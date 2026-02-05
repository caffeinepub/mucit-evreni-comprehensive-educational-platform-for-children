# Specification

## Summary
**Goal:** Let users quickly copy the raw student number from the Student Profile / Profile Settings screen.

**Planned changes:**
- Add a copy-to-clipboard icon/button next to the displayed student number on `frontend/src/pages/ProfileSettings.tsx`.
- Implement copy logic to place the unformatted `studentNumber` value (no spaces) into the system clipboard.
- Add success feedback after copying and error feedback when copying is unavailable/fails, without navigating away.
- Ensure the copy control is keyboard-accessible and includes an accessible label (e.g., `aria-label="Copy student number"`).

**User-visible outcome:** On Profile Settings, users can click (or keyboard-activate) a copy button next to their student number to copy it to the clipboard and receive clear success/error feedback.
