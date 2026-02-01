# Task: Code Review & Bug Hunting

- [x] Security & Auth Audit
    - [x] [Backend] Verify JWT expiration and refresh logic
    - [x] [Backend] Audit CORS settings for production
- [x] Data Integrity Audit
    - [x] [Backend] Check MongoDB/Postgres synchronization edge cases
    - [x] [Backend] Verify Beanie/Pydantic validation for malformed inputs
- [x] Frontend Resilience
    - [x] [Frontend] Audit API error handling in `src/services/api.ts`
    - [x] [Frontend] Check for "Zombie States" in Zustand after logout
- [x] UX Consistency
    - [x] [Frontend] Review MobileNav vs Sidebar visibility logic
    - [x] [Frontend] Verify responsive layouts on extreme aspect ratios
- [x] Bug Squashing
    - [x] Fix identified priority 1 issues
