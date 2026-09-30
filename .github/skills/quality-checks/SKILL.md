---
name: quality-checks
description: Handles all test, lint, and quality-check execution for this project — running Vitest unit tests, Playwright E2E tests, ESLint, and the Astro type check; debugging failures; verifying code changes; and validating readiness before commits, pushes, or merges. Use this skill instead of running test, lint, or verification commands (such as npm run test:unit, npm run test:e2e, npm run typecheck, or npm run lint) directly.
---

# Quality checks

Use this skill when you need to validate changes in Caldova Careers.

## Quick reference

| Check | Command | Notes |
| ----- | ------- | ----- |
| Unit tests | `npm run test:unit` | Vitest tests for pure helpers and the applications layer. |
| E2E tests | `npm run test:e2e` | Playwright runs against the built Node server. |
| Lint | `npm run lint` | ESLint over the project. |
| Typecheck | `npm run typecheck` | Runs `astro check`; this is the single typecheck command. |

## E2E setup

Playwright's `webServer` builds the app and starts the Node server with `npm run build && npm run start`. It does not use `astro preview`. The default port is `4321`; set `PLAYWRIGHT_PORT` to avoid a local conflict. If Chromium is missing, run `npm run test:e2e:install`.

## Database notes

The only database table is `applications`. `npm run db:setup` runs migrations only; there is no seed step because jobs are Markdown content files. Local SQLite data lives under `.data/careers.db`, which is gitignored.

For a clean local rebuild, run:

```bash
rm -rf .data dist && npm run build
```

## Port conflicts

If Playwright cannot start the server because the port is busy, prefer setting `PLAYWRIGHT_PORT` for the run. If a stale server is still needed for investigation, identify and stop that specific process before rerunning.
