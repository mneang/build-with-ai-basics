---
doc: checklist
status: approved
---

# Build Checklist

## Slices

- [x] **1. Generate structured scenarios from a software change**
  Becomes usable: A local Next.js app runs in Codespaces; a user can enter a software change, submit it, and receive validated structured scenario cards from Gemini.
  Why now: This is the core kernel and the highest-risk dependency. It combines project bootstrapping, the server-side model call, the Zod response contract, and a minimal visible path so we discover API assumptions early.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Generate structured scenarios`
  Spec ref: `spec.md > How This Works, In Plain Language`, `spec.md > Generate API Route`, `spec.md > Scenario Schema`, `spec.md > File Structure`
  Build: Scaffold the Next.js TypeScript project, install only Next.js, Gemini SDK, and Zod dependencies, create `.env.example` and `.gitignore`, implement the shared scenario schemas, implement `POST /api/generate`, and build the first page that submits a change and renders the returned scenarios.
  Verify (mechanical): Run the project typecheck/build and start the dev server; send an empty request and confirm a `400` response; with a configured Gemini key, submit the example change and confirm a successful `{ "scenarios": [...] }` response with 3–4 validated scenarios and no server-side errors.
  Learner check: Open the local app, enter “Require a reason when a user cancels an order.”, generate scenarios, and report whether the returned cards demonstrate the structured UAT idea.
  Commit: `Build core UAT scenario generation`

- [x] **2. Make the core journey predictable**
  Becomes usable: The page clearly handles first use, empty input, loading, successful repeat generation, and recoverable generation errors while preserving the user's input.
  Why now: Once the kernel works, these are the product behaviors that make the prototype understandable and reliable during a real local demo.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > UAT Generator Page`, `spec.md > Generation Form`, `spec.md > Scenario Results`, `spec.md > Important Failure Modes`
  Build: Add the approved light businesslike styling, instructional initial results state, inline empty-input validation, disabled “Generating…” button state, user-facing API error message, input preservation, and replacement of old results after a new successful generation. Render optional preconditions only when present and keep required fields consistent.
  Verify (mechanical): Run lint/typecheck/build; exercise the empty submission without a network call, confirm the loading button is disabled during a request, confirm a successful second request replaces the first result set, and confirm a forced API failure preserves the input and displays the simple error message.
  Learner check: Try an empty submission, a normal generation, an edited second generation, and a retry after an error. Report anything confusing or visually out of place.
  Commit: `Polish UAT generation states`

- [x] **3. Make the Codespaces handoff clear**
  Becomes usable: A public-repository reader can understand the setup, configure the API key safely, run the app locally, and verify the core journey.
  Why now: The working prototype needs a clean, reproducible local handoff, and documentation is easiest to write against the finished behavior.
  PRD ref: `prd.md > What We're Building`, `prd.md > Non-Goals`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`, `spec.md > File Structure`
  Build: Add or update the README with Codespaces/local setup, `.env.example` usage, the local run command, API-key safety notes, and a short manual verification path. Confirm no secret or deployment requirement is introduced.
  Verify (mechanical): Run the documented install and validation commands from a clean working state, inspect tracked files for secrets, and confirm the production build succeeds. Check that `.env.example` contains only the placeholder and `.env.local` is ignored.
  Learner check: Follow the README from the repository as if you were a new Codespaces user and report whether any setup step is unclear.
  Commit: `Document local Codespaces setup`

## Hands-on Checkpoints

- [ ] First usable behavior explored — after slice 1
- [ ] Integrated core journey tried — after slice 2
- [ ] Final kick-the-tires exploration and feedback completed — after slice 3

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] One action followed through 2–3 actual code locations with the learner
- [ ] One optional incidental edit offered — record tried/kept/reverted/declined
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown

Route and stops: [action, real paths and symbols; completed stops if interrupted]
Edit outcome: [what happened, including declined; verification if changed]
Tour mode: [live app and editor, or explicit static fallback and why]

## Revisions

- Gemini rejected the initially selected `gemini-2.5-flash` model for the configured account; the model is now configurable through `GEMINI_MODEL` and defaults to the provider-recommended `gemini-3.6-flash`.
- Learner feedback found double-numbered steps and unsupported product-specific assumptions in generated scenarios; the UI now removes model numbering and the generation instruction requires neutral wording when the input does not provide implementation details.
