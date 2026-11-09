# Tech-debt scan (McHardex/apod#19)

Scan of `main` at `61118ed`. Ten items, ordered by impact on users first, then maintenance cost.

## Prioritization

Items were ranked by:

1. **User-visible breakage**: does a normal flow show wrong data or hang?
2. **Blast radius**: how many flows depend on the code?
3. **Fix risk**: can it be fixed without changing dependencies or behaviour users rely on?

Items 1-3 are the only ones that break or degrade a normal user flow today, and each fix is local to one module. They are fixed in this change. Items 4-10 are maintenance debt or need riskier changes (dependency upgrades), so they are left as follow-ups.

## Inventory

| # | Item | Where | Impact | Status |
|---|------|-------|--------|--------|
| 1 | Date helpers parse `YYYY-MM-DD` as UTC and read it back as local time. Behind UTC, "next" stays on the same day and "previous" skips a day, hover previews show the wrong day, and the date input's `min` is a day early. `nextDay`/`previousDay` were copy-pasted. | `src/utilities/index.ts` | Prev/next navigation and hover preview are wrong for users in the Americas | **Fixed** |
| 2 | Both thunks read `error.response.data`, which throws when there is no response (network, CORS, timeout). The failure action is never dispatched, so the loader spins forever. | `src/actions/apod.ts` | App hangs on any network failure, both for the main picture and the hover preview | **Fixed** |
| 3 | `Apod` fetches the picture twice on a cold load (mount effect plus the `[dateValue]` effect). | `src/components/Apod/index.tsx` | Two NASA API calls per visit, which counts double against the API key's rate limit | **Fixed** |
| 4 | Reducer state is `picture?: any`. Loading drops `picture`, and failures store the error body in `picture`. | `src/reducers/module/apod.ts` | Type safety; error and data mixed in one field | Follow-up |
| 5 | `Apod` mixes Redux, Firebase, localStorage, hover state and navigation. Favorites are stored in two places, and `.then(getFavoritePictures).catch(console.log)` is repeated three times. | `src/components/Apod/index.tsx` | Hard to change safely | Follow-up (corrupt-localStorage crash fixed, see below) |
| 6 | Outdated dependencies: `node-sass@4` (deprecated, does not build on Node 22), `react-scripts@4`, `axios@0.21` (known CVEs), firebase v8 namespace import, `@types/redux*` stub packages, test libraries listed under `dependencies`. | `package.json` | Security; setting up a new machine fails | Follow-up (needs its own upgrade PR) |
| 7 | Weak tests: the `Apod` suite crashed on import (Firebase initialized without config), the Portal test has no assertions, and there are no reducer, Popup or FavoritePictures tests. | `src/__tests__` | Regressions go unnoticed | Partly fixed (Apod suite runs, new date, action and flow tests) |
| 8 | `.env.example` lists `REACT_APP_FIREBASE_DATABAS_URL`, but the code reads `REACT_APP_FIREBASE_DATABASE_URL`. | `.env.example` | Misconfigured Firebase on fresh setups | Follow-up |
| 9 | FavoritePictures uses `title` as the list key; Popup's `useEffect` is missing the `date` dependency. | `src/components/FavoritePictures`, `src/components/Popup` | Possible stale renders | Follow-up |
| 10 | `http()` builds a new axios instance on every call, the interceptor is misnamed, the query string is built by hand, and `yarn lint` only checks `.ts` files. | `src/api`, `src/services`, `package.json` | Maintenance | Follow-up |

## How the fixes keep existing flows working

Every navigation still goes through `setDateValue`, which triggers the single fetch effect in `Apod`. Each flow is covered by `src/__tests__/components/Apod.spec.tsx`:

- **First visit, or a stale cached picture** (no `url`, no `date`, or invalid JSON): one fetch for today.
- **Valid cached picture:** one fetch for the cached date.
- **Date input, previous/next buttons, previewing a favorite:** one fetch for the chosen date.
- **"Rescue me":** fetches the configured `REACT_APP_RESCUE_USER_DATE`, or the first APOD date (`1995-06-16`) when it is unset.
- **Failed requests:** both thunks share `toErrorPayload` (`src/actions/apod.ts`), so the main picture and the hover preview both reach their error state.

Unchanged behaviour: as on `main`, the previous/next buttons are not clamped to `1995-06-16` or today; only the date input enforces those limits. Going past either end shows the API's error message and the "Rescue me" button.

Corrupt `localStorage` entries no longer crash the first render. `readStoredJson` (`src/utilities/index.ts`) falls back to a default value, and all three parse sites in `Apod` use it.
