# Firestore Security Specification - Keep Companion Workspace

## 1. Data Invariants
- A Keep note MUST be owned by an authenticated user and have a non-empty `userId` matching `request.auth.uid`.
- Users must only be allowed to read, search, update, or delete Keep notes where the document's `userId` field exactly matches their own `uid`.
- The list of tags of a note is bounded and can have at most 20 tags to prevent malicious Denial of Wallet (resource exhaustion) attacks.
- Note titles and color codes are string types, subject to explicit maximum size boundaries.
- Timestamps must correspond to the server time when any creation or edit is applied.

## 2. The "Dirty Dozen" Malicious Payloads
Here are the 12 specific JSON payloads designed to breach identity, integrity, and state, which will be strictly rejected:

1. **Anonymous Creation**: Attempting to write a note without any active auth credentials.
2. **Identity Spoofing**: Attempting to write a note with someone else's `userId` in the payload.
3. **Ghost Field / Shadow Update**: Attempting to update or create a note with unverified fields like `isAdmin: true` or `isVerified: true`.
4. **Invalid Type Injection**: Attempting to transition `type` to an unsupported value (e.g., `"audio"` or `"drawing"`).
5. **Tags Overflow**: Injecting more than 20 tags in the `tags` array to trigger processing overhead.
6. **Title Payload Bloat**: Injecting a massive 1MB string into the note title to exhaust storage.
7. **Orphaned Write**: Trying to delete or edit a note belonging to a different user.
8. **Malicious ID Injection**: Creating a note with a huge corrupted document ID to provoke database indexes.
9. **Query Scraper Bypass**: Fetching notes without specifying the owner `userId` parameter.
10. **Future/Past Timestamp Spoofing**: Providing a mock `updatedAt` client-side value not validated by standard rules.
11. **Negative Array Injection**: Attempting to save a checklist with broken indices.
12. **State Shortcutting**: Updating immutable fields like `userId`.

## 3. Security Rules Validation Criteria
All standard read, write, query, and single-document fetch actions must enforce strict schema evaluation and ownership match.
If any condition is violated, Firestore must return `PERMISSION_DENIED`.
