# Technical debt scan

Inventory from issue #19 (max 10). **Top 3** were fixed in this change set.

## Prioritized (fixed)

1. **Unsafe API error handling** — Redux thunks assumed `error.response.data` exists; network failures could throw during dispatch. Fixed with shared payload extraction and user-facing fallback.
2. **Firebase initializes at import** — `firebaseSetup` called `initializeApp` when the module loaded, breaking unit tests without env vars. Fixed with lazy `getFirestore()` on first Firestore access.
3. **`.env.example` typo** — Documented `REACT_APP_FIREBASE_DATABAS_URL` while code reads `REACT_APP_FIREBASE_DATABASE_URL`, causing silent misconfiguration for new setups.

4. **Test hygiene (supporting)** — `Apod` tests could not run without Firebase env; added `firebaseService` mock. Portal spec no longer calls `screen.debug()` without an assertion.

## Additional findings (not fixed here)

5. **Duplicated thunk shape** — Remaining reducer/UI duplication around picture loading (thunk fetch path consolidated via `fetchApodForDate`).
6. **Redundant fetches on mount** — `Apod` mounts two `useEffect` hooks that can both trigger `getPictureOfTheDay` when localStorage is empty.
7. **File-wide `eslint-disable no-console`** — `components/Apod` silences lint for logging instead of a small logger or targeted disables.
8. **`picture?: any` in reducer** — Weak typing in `reducers/module/apod.ts`; should use `Picture` or a dedicated error shape.
9. **Misnamed axios interceptor** — `unauthorizedRequestInterceptor` only handles generic network errors.
10. **Outdated dependencies** — e.g. `axios@0.21`, `node-sass`, Firebase v8 modular migration; security and build-tooling risk.
