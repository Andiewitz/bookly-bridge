# Code Review Plan: Project Booklyn

This plan outlines the systematic audit of the Booklyn codebase to identify bugs, performance bottlenecks, and security gaps before further scaling.

## Audit Focus Areas

### 1. Security & Authentication
- **JWT Handling**: Ensure tokens are not leaked in local storage (should be HttpOnly cookies).
- **Role Guards**: Verify that Bands cannot access Venue-only endpoints and vice versa.
- **Payload Validation**: Check for missing Type checks in FastAPI that could lead to crashes.

### 2. Service Performance
- **Mongo Indexing**: Confirm that `$text` search isn't being bypassed by inefficient query builders.
- **SQL Optimization**: Ensure Postgres relationships (User -> Profile) aren't causing N+1 query problems.

### 3. Frontend Reliability
- **State Cleanup**: Verify that switching roles (Finding -> Hosting) correctly clears/refetches the context-specific data.
- **Error Boundaries**: Ensure an API failure in one component doesn't crash the entire Dashboard.

## Review Schedule

| Service | Target Files | Key Concern |
| :--- | :--- | :--- |
| **Backend / Auth** | `auth.py`, `deps.py` | Token refreshing logic |
| **Backend / Gigs** | `gig_mongo.py`, `gig.py` | Query performance & Atomicity |
| **Frontend / State** | `useAuthStore.ts` | State persistence across sessions |
| **Frontend / UI** | `browse/page.tsx`, `DashboardSidebar.tsx` | Responsive layout collisions |

---
**Verification**: Any bugs found will be documented in a temporary `review_feedback.md` and fixed immediately.
