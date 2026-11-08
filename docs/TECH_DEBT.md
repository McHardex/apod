# Technical debt scan (APOD)

Findings limited to 10 items, ordered by severity. **Top 3 (P0)** were fixed in this change set; item **#4** was fixed incidentally while touching `Apod`.

| # | Issue | Priority | Status |
|---|--------|----------|--------|
| 1 | `Apod` mounts two `useEffect` hooks that both trigger `getPictureOfTheDay` when cache is empty (duplicate NASA API calls). | P0 | **Fixed** |
| 2 | Redux thunks assume Axios errors expose `error.response.data` and can throw in the catch block. | P0 | **Fixed** |
| 3 | Firebase Firestore initializes at module import; Jest loads `Apod` specs without env vars and the suite fails to start. | P0 | **Fixed** (lazy `getFirestore()` in app; `jest.mock` on `firebaseService` in component tests) |
| 4 | Stray `;` after `<Loader />` in `Apod` render output. | P1 | **Fixed** |
| 5 | `Popup` hover preview `useEffect` omits `date` / `getPreviousOrNextPicture` from deps (stale preview risk). | P1 | Open |
| 6 | Reducer redefines `Picture` slice state with `picture?: any` instead of shared `Picture` type. | P2 | Open |
| 7 | `getFavoritePictures` wraps a single promise in `Promise.all([...])` without benefit. | P2 | **Fixed** |
| 8 | ESLint `lint` script only targets `.ts`, not `.tsx` components. | P2 | Open |
| 9 | `node-sass` pins native builds and breaks on modern Node without Python toolchain. | P2 | Open |
| 10 | `typedAction` / action payloads use `any`, weakening reducer type safety. | P3 | Open |

## Top 3 rationale

1. **Duplicate fetch** wastes API quota and can cause racey UI updates on first load.
2. **Unsafe error handling** turns network failures into unhandled exceptions instead of error UI.
3. **Firebase init at import** blocks the component test suite and couples all imports to production config.
