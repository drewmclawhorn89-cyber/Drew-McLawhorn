# Security Specification: Instagram Web Authentication & Profiles

## 1. Data Invariants
- Each user profile document is located at `/users/{userId}`.
- Public read access is permitted for user profiles to enable community browsing.
- Only the authenticated owner (`request.auth.uid == userId`) may create or modify their own user document.
- Users cannot impersonate another UID.
- Private sensitive info is isolated under `/users/{userId}/private/info` and strictly readable only by the owner.

## 2. The "Dirty Dozen" Threat Scenarios
1. Unauthenticated write to `/users/{userId}` -> Rejected (must be signed in).
2. Authenticated user A writing to `/users/{userB}` -> Rejected (cannot spoof owner).
3. Authenticated user A reading `/users/{userB}/private/info` -> Rejected (private info restricted to owner).
4. Profile creation without required `username` -> Rejected (missing required fields).
5. Injecting oversized string (>1000 chars) into avatar -> Rejected (size bounds check).
6. Changing another user's followers count directly -> Rejected (owner check).
7. Injecting arbitrary malicious fields into user profile -> Rejected (strict key set).
8. Non-owner deleting a user profile -> Rejected.
9. Writing invalid ID format as userId -> Rejected (regex check).
10. Anonymous user modifying profile when verified email is enforced -> Rejected.
11. Bypassing client SDK to overwrite private collection -> Rejected.
12. Injecting empty string or non-string username -> Rejected.
