# Onboarding Form

Onboarding form built for the Venn front-end take-home task.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · React Hook Form · Zod · TanStack Query · libphonenumber-js · Tailwind CSS 4 + shadcn/ui · Vitest + React Testing Library · Biome

## Running

Requires Node 20+. The lockfile is for [Bun](https://bun.sh), but npm/pnpm work too.

```bash
bun install        # or npm install
bun run dev        # http://localhost:3000
```

Other scripts:

```bash
bun run build      # production build
bun run start      # serve the production build
bun run lint       # biome check (lint + format check)
bun run format     # biome format --write
```

No environment variables are needed; the API base URLs are constants in `src/queries/`.

## Testing

```bash
bun run test        # single run
bun run test:watch  # watch mode
```

Tests run in Vitest with jsdom. `fetch` is stubbed in the component tests, so no network access is required.

- `src/components/onboarding-form/onboarding-form.test.tsx` — integration tests via React Testing Library: required-field errors on empty submit, on-blur phone validation, `+1` prefill on focus, on-blur corporation-number lookup against the (mocked) API, lookup caching (both valid and 404/invalid results), lookup-failure messaging, submit-button disabled states, and 200 / 400 submission handling.
- `src/lib/schemas/onboarding.test.ts` — unit tests for the Zod schema and `isCanadianPhoneNumber`.

## Project structure

```
src/
  app/                       Next.js app shell (layout, page, React Query provider)
  components/
    onboarding-form/         The form, its tests, and the async-validation resolver hook
    common/                  Reusable form primitives (FormTextField, FormSubmitButton, FormContainer)
    ui/                      shadcn/ui components
  lib/schemas/onboarding.ts  Zod schema + sync validation rules
  queries/                   API calls and React Query hooks (corporation number lookup, submission)
```
