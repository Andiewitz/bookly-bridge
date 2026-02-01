# Code Review Feedback: Project Booklyn

## 🔴 Priority 1: Critical / Security

### 1. Missing JWT Token Refresh
- **Issue**: `backend/app/api/v1/endpoints/auth.py` generates a `refresh_token`, but there is no endpoint to consume it. Users are locked out after 30 minutes.
- **Fix**: Implement `POST /auth/refresh-token`.

### 2. Missing Role Guards on Gig Posting
- **Issue**: `POST /api/v1/gigs/` does not verify if the user has a `Venue` role (once roles are mandatory). Currently, anyone can post a gig.
- **Fix**: Add a role check dependency or logic in the endpoint.

### 3. Frontend Token Expiration Handling
- **Issue**: `src/services/api.ts` adds the token but doesn't catch `401 Unauthorized` to trigger a logout or refresh.
- **Fix**: Add an axios response interceptor.

## 🟡 Priority 2: Logic & Consistency

### 1. MongoDB/Postgres Orphaned Data
- **Issue**: If a User is deleted from Postgres, their Gigs remain in MongoDB.
- **Fix**: Add a cleanup task or background worker for cascading deletes.

### 2. Generic Error Handling
- **Issue**: `get_current_user` in `deps.py` uses a naked `except` block.
- **Fix**: Catch specific `jose.exceptions.ExpiredSignatureError`.

## 🟢 Priority 3: UX & Polish

### 1. Skeleton UI Integration
- **Issue**: Most pages use a simple spinner or "Loading..." text.
- **Fix**: Replace spinners with the new `Skeleton` component in `BrowsePage` and `PublicProfilePage`.

---
**Next Step**: I will begin fixing the Priority 1 issues immediately.
