# Dev Log: Resolving the Auth Gridlock
**Date: January 30, 2026**

I'm back in the flow today, but things weren't as smooth as I left them. I tried to jump into the dashboard, but I was blocked at the first hurdle: I couldn't log in or create a new account. Every attempt led to either a blank screen or a cryptic backend error.

Here is the breakdown of how I isolated and squashed these bugs.

---

## 1. The "NotNull" Wall (Backend/DB)

### The Bug
When I tried to sign up, the backend was returning a 500 error. Looking at the logs, it was a `NotNullViolation: null value in column "role" violates not-null constraint`.

### My Thought Process
I realized that when we moved to the "Unified Fiverr Approach," we stopped asking the user for their role during signup to keep the UX clean. However, the PostgreSQL schema was still strictly enforcing that a `role` must be present (`NOT NULL`). Because I was trying to save a user without a role, the database was rightfully slamming the door shut.

### The Fix
I updated the **Registration Page** to include a sleek role selection UI (Band vs. Venue). This satisfies the database requirements while setting the user's "Default Context." I also updated the backend schemas and the SQLAlchemy `User` model to ensure the role is passed through and validated correctly.

---

## 2. The "Anonymous Token" (Frontend)

### The Bug
Even after fixing the database, the app would hang after registration. The user would appear logged in but have no name, no email, and no dashboard data.

### My Thought Process
I dug into the `RegisterPage` logic and saw that after a successful signup, I was logging the user in and getting a token, but I was never actually fetching the user's *profile data*. The frontend state was being populated with the login response (which is just tokens), but the dashboard depends on having a `User` object with an email and role.

### The Fix
I updated the registration flow to perform a follow-up request to `/users/me` immediately after getting the tokens. Now, the `AuthStore` is fully primed with the user's profile before the dashboard renders.

---

## 3. The "Invisible Import" Crash (Backend)

### The Bug
Token refreshing was completely dead. Checking the backend logs showed `NameError: name 'jwt' is not defined`.

### My Thought Process
This was a classic oversight. Yesterday, while I was hyper-focused on implementing the new `refresh-token` logic, I used the `jwt` library to decode payloads in the auth endpoint file. I had the logic right, but I simply forgot to add `from jose import jwt` at the top of `auth.py`.

### The Fix
Added the missing import. It was a 2-second fix that solved 100% of the persistent login crashes.

---

## 4. The "Memorable Refresh" (Security/Frontend)

### The Bug
The session security interceptor I built was failing to auto-refresh tokens, forcing a redirect to the login page every few minutes.

### My Thought Process
The interceptor was looking in `localStorage` for a `refresh_token`, but when I checked the browser dev tools, it wasn't there. It turns out the `AuthStore` was only persisting the `access_token` to the browser, while the `refresh_token` stayed in volatile React memory (Zustand). As soon as the page refreshed, the "auto-repair" key was lost.

### The Fix
I updated `useAuthStore.ts` to persist **both** tokens to `localStorage`. Now, even if you close the tab and come back, the interceptor can find the refresh key and keep you logged in without asking for your password again.

---

## The Verdict
The **Modular Monolith** made this significantly easier. I didn't have to touch the Gig discovery logic, the Audio Player, or the Applications view. Because the issues were strictly in the "Auth/User" domain, I could operate with precision without worrying about breaking the rest of the app.

**System is now: 🟢 Healthy | 🛡️ Secure | 🚀 Ready for Scale.**
