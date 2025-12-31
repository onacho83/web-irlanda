## Summary

Describe the changes introduced by this PR and the rationale.

## Changes
- Refactor renderers to extend `BaseRenderer`
- `PresentacionRenderer` and `ServiciosRenderer` updated to accept config instead of reading localStorage
- Added unit tests for renderers, theme applier, section style manager and controllers

## Checklist
- [ ] Tests added/updated
- [ ] Lint passes
- [ ] No direct access to localStorage from renderers
- [ ] PR targets `main` or `develop` (as per repo policy)

## Notes
CI will run tests and lint automatically; please review any failing checks and report back.