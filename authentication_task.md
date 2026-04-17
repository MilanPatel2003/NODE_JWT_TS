# MILAN PATEL
# Authentication & Authorization Task — Functional Specification

## 1. Overview
This document specifies the functional requirements, validation rules, and implementation approach for an authentication and authorization system. It covers Registration, Login, Captcha, and Forgot Password flows.

## 2. Modules

### Registration
- Fields
  - **email**
  - **username**
  - **firstname**
  - **lastname**
  - **role** (default: user)
  - **password**
  - **confirm_password**
- Validations
  - All fields are required.
  - Email uniqueness check:
    - Validate while user is typing (live check) and on final submission.
    - Consider checking uniqueness scoped by user type if applicable.
  - Basic validations:
    - Email format.
    - Username length/characters.
    - Password strength (min length, complexity).
    - confirm_password must match password.
- Approach
  - Client-side: Immediate feedback for required fields, format checks, password strength meter, and live email-availability check via API.
  - Server-side: Re-run all validations, enforce email uniqueness transactionally to avoid race conditions, hash password with a secure algorithm (e.g., bcrypt), assign default role, return clear error codes/messages.

### Login
- Fields
  - **email**
  - **password**
  - **remember_me** (boolean — when true, increase token/session expiration)
- Services & features
  - **Captcha** integration (see Captcha module).
  - **Forgot password** link/service.
- Validations & security rules
  - Basic validations: required fields, email format.
  - Failed-attempt handling:
    - After 4 consecutive incorrect password attempts, force the user to set a new password (or require password reset flow).
  - Session/token handling:
    - Issue access token and refresh token (or server session cookie).
    - If remember_me is true, extend token expiration securely.
- Approach
  - Client-side: Basic input validation and optional captcha trigger.
  - Server-side: Authenticate credentials, issue tokens with appropriate lifetimes.

### Captcha
- Requirements
  - Custom design (image-based or popup-based).
  - Regeneration rule: If user solves captcha within 3 seconds, regenerate a new challenge (to prevent automated quick solves or replay).
  - Expiry: Captcha must be solved within 1 minute; otherwise, a new captcha is issued.
- Approach
  - Measure solve time client-side and report to server; if solve_time < 3s, mark as suspicious and generate a fresh challenge.

### Forgot Password
- Fields / Flow
  - **email** (entered to request password reset — currently, instead of sending email, open a new page with the email as a query parameter)
  - **new_password**
  - **confirm_password**
- Validations
  - new_password and confirm_password must match.
  - Enforce password-strength rules consistent with registration.
- Flow
  - Request reset: User provides email. System opens reset page with email included as a query parameter (temporary behavior).
  - Reset page: User enters new_password and confirm_password; on successful validation and submission, navigate to Login.
- Approach
  - Server-side: Validate that email exists (but avoid revealing existence — return a generic response).
  - Use one-time, time-limited reset tokens in production email flows (not required for current temporary behavior).
  - On submit: validate passwords, update stored password (hash) and redirect to Login.

## 3. Practices to follow
- Security
  - Store passwords with a modern hashing algorithm (bcrypt).
  - Use HTTPS for all endpoints.
- Logging
  - Log security-relevant events (failed/successful logins, password changes, captcha failures).