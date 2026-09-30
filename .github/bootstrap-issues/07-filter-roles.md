# Filter roles by department
<!-- labels: workshop:filtering -->

Candidates should be able to narrow roles by department, and the filtering foundation should be reusable for additional facets like remote status or employment type.

## Acceptance criteria

- [ ] The home page includes an accessible department filter.
- [ ] Filtering uses helpers in `src/lib/` that operate on `Job[]` arrays.
- [ ] The filter can combine with remote or employment type filters if those are implemented.
- [ ] Empty states are clear when no roles match.
- [ ] Controls include stable `data-testid` attributes.
- [ ] Unit tests cover filtering behavior.
- [ ] Playwright tests verify department filtering.
