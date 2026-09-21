---
doc: spec
status: approved
---

# UAT Scenario Generator — Technical Spec

## How This Works, In Plain Language

The app is one Next.js project. The browser page gives the user a text area and displays scenario cards. When the user clicks generate, the page sends the software-change text to one server-side route at `/api/generate`.

That route checks that the submitted change is not empty, asks Google Gemini for a structured object containing scenarios, and validates the returned object with Zod. The API key exists only in a server-side environment variable, so the browser never receives it. If validation succeeds, the route returns `{ "scenarios": [...] }` to the page, which renders the fields in a consistent layout. If input validation, the model call, or response validation fails, the route returns a simple error and the page shows a retryable message.

There is no database, authentication, saved history, deployment requirement, or extra backend service. The app is intentionally one page plus one API route so it is easy to run and understand in GitHub Codespaces.

## The Core Journey Through the System

1. The user opens the local Next.js app. The page component renders the title, explanation, text area, example prompt, generate button, and initial results message.
2. The user enters a software change. The page keeps the current text in browser memory.
3. The user clicks **Generate UAT Scenarios**. The page rejects an empty value locally; otherwise it disables the button and sends `POST /api/generate` with `{ "change": "..." }`.
4. The route validates that `change` is a non-empty string before calling Gemini.
5. The route sends a prompt that asks Gemini for approximately 3–4 concise, balanced UAT scenarios and requests the agreed structured response shape.
6. Gemini returns an object. The route validates it with the shared Zod schema. Invalid or incomplete output is treated as a generation failure rather than partially rendered.
7. On success, the route returns `{ "scenarios": [...] }`. The page replaces any previous results with the latest set of scenario cards.
8. On an error, the route returns a simple error response with an appropriate HTTP status. The page preserves the input and shows a non-technical retry message.

PRD ref: `prd.md > The Core Journey`, `prd.md > States and Boundaries`.

## Stack

- **Next.js** with the App Router — one project can contain the page and server-side route. Use the current stable version selected during setup; verify the version and current setup command before installation.
  - Documentation: https://nextjs.org/docs
- **TypeScript** — provides types for the request, response, and scenario data while keeping the learner's existing JavaScript/TypeScript experience useful.
  - Documentation: https://www.typescriptlang.org/docs/
- **Google Gemini official JavaScript SDK** — makes the server-side model call from the route. Use the current official package and API shown in Google's current documentation; verify the package name, model name, and structured-output syntax during implementation.
  - Documentation: https://ai.google.dev/gemini-api/docs
- **Zod** — validates the request and the complete model response at runtime. This is one intentional dependency because the API boundary should reject malformed data explicitly.
  - Documentation: https://zod.dev/
- **React** — supplied through Next.js for the interactive page and scenario-card rendering. Avoid adding a UI component library for this small surface.
  - Documentation: https://react.dev/

The exact dependency versions and Gemini model are build-time verification items because current SDK APIs, model availability, and free-tier limits can change.

## Where It Runs and How Someone Tries It

The app runs locally in GitHub Codespaces as a Next.js development server. No deployment or hosted URL is required for this assignment.

Environment requirements:

- Node.js version supported by the selected current Next.js version.
- A Google Gemini API key stored in a local environment file such as `.env.local` using the server-only variable name selected during implementation, for example `GEMINI_API_KEY`.
- The environment file must be excluded from the public repository through `.gitignore`. A safe example variable belongs in `.env.example`, never a real key.

Local commands:

```text
npm install
npm run dev
```

Then open the local URL shown by Next.js, normally `http://localhost:3000`, using the Codespaces forwarded port if needed. The public repository should include a README with the setup steps, required environment variable name, and local run command.

## Look and Feel

Implement `prd.md > Look and Feel` with a light, polished, businesslike interface:

- White or very light background with restrained blue accents.
- Modern, readable typography with clear hierarchy.
- Generous spacing and vertically stacked scenario cards.
- Soft borders or light shadows, without excessive decoration.
- No gradients, glowing effects, chatbot bubbles, navigation, sidebar, login, or extra controls.
- Copy should be concise and understandable, including loading, validation, and error messages.

## Components

### UAT Generator Page

The single page renders the title, explanation, input text area, example prompt, generate button, initial message, and results area. It keeps the current input, loading state, error message, and latest scenarios in browser memory. It sends only the `change` value to `/api/generate` and replaces the results after a successful response.

Implements `prd.md > Screens and Layout`, `prd.md > Describe a software change`, and `prd.md > States and Boundaries`.

### Generation Form

The form handles submission. It trims or checks the input before making a request, displays the inline empty-input message without calling the server, disables the button during the request, and shows a loading label such as **Generating…**. It preserves the input after success or failure.

Implements `prd.md > Describe a software change` and `prd.md > States and Boundaries`.

### Scenario Results

The results area renders the `scenarios` array from the successful API response as approximately 3–4 vertically stacked cards. Every card renders the required title, scenario type, numbered steps, and expected result. It renders preconditions only when the optional field is present. It does not retain older results after a newer successful generation.

Implements `prd.md > Generate structured scenarios` and `prd.md > States and Boundaries`.

### Generate API Route

`POST /api/generate` is the only server-side application route. It accepts `{ "change": "..." }`, validates the non-empty string, calls Gemini using the server-only API key, validates the complete structured response, and returns either `{ "scenarios": [...] }` or a simple error object. It must never return a partial or unvalidated scenario set.

Implements `prd.md > Generate structured scenarios`, `prd.md > States and Boundaries`, and `prd.md > Product Decisions`.

### Scenario Schema

The shared Zod schema defines the response contract:

- `title`: required string
- `type`: required scenario-type string, such as Happy Path, Validation, Negative, or Edge Case
- `steps`: required non-empty array of strings
- `expectedResult`: required string
- `preconditions`: optional string, rendered only when relevant

The response schema wraps the array in an object with a required `scenarios` array. The schema should also enforce the practical 3–4 scenario range unless implementation testing shows that a looser bound is needed to handle model behavior safely.

Implements `prd.md > Generate structured scenarios`.

## API Contract

### Request

```http
POST /api/generate
Content-Type: application/json
```

```json
{
  "change": "Require a reason when a user cancels an order."
}
```

The route rejects a missing, non-string, or whitespace-only `change` before calling Gemini.

### Success response

```json
{
  "scenarios": [
    {
      "title": "Cancel an order with a reason",
      "type": "Happy Path",
      "preconditions": "An order exists and can be cancelled.",
      "steps": [
        "Open an eligible order.",
        "Select Cancel Order.",
        "Enter a cancellation reason.",
        "Confirm the cancellation."
      ],
      "expectedResult": "The order is cancelled and the reason is saved."
    }
  ]
}
```

`preconditions` may be omitted when it is not relevant. The other fields are required for every scenario.

### Error responses

Use a simple shape such as:

```json
{
  "error": "Unable to generate scenarios."
}
```

Use `400` for invalid request input and an appropriate server-side failure status such as `500` for Gemini failures or invalid model output. Do not expose API keys, provider internals, raw prompts, or detailed service errors to the browser.

## Data Model

The app has no persistent data model. All values exist only while the page is open:

- `change`: the current text area value, held in browser memory and sent only on submit.
- `isGenerating`: whether the request is in progress, used to disable the button and show loading text.
- `errorMessage`: the current user-facing validation or generation message.
- `scenarios`: the latest validated response array, held in browser memory and replaced after a successful generation.

The server creates no user record and stores no request or result. If the user leaves or refreshes the page, the input and results disappear.

## File Structure

```text
project/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # Validates input, calls Gemini, validates output, returns API response
│   ├── globals.css              # Page and scenario-card styling
│   ├── layout.tsx               # Root document metadata and shared layout
│   └── page.tsx                 # Single-page form, loading/error states, and results rendering
├── lib/
│   ├── gemini.ts                # Server-side Gemini client/configuration helper
│   └── schemas.ts               # Zod request/response and Scenario schemas
├── public/                      # Static assets, kept empty unless the page needs one
├── .env.example                 # Safe placeholder documenting the server-only Gemini API key variable
├── .gitignore                   # Excludes secrets, dependencies, and build output
├── next-env.d.ts                # Next.js TypeScript declarations
├── next.config.ts               # Minimal Next.js configuration, only if required
├── package.json                 # Scripts and minimal dependencies
├── README.md                    # Codespaces setup, environment variable, run, and test instructions
└── tsconfig.json                # TypeScript configuration
```

The `devpost/` planning directory remains alongside the application files and is included in the public repository as project documentation.

`.env.example` should contain only a non-secret placeholder, for example:

```text
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

It must never contain a real API key. The real values belong in the local, ignored `.env.local` file. `GEMINI_MODEL` can be changed there if the provider makes a different current model available to the account.

## External Services and Dependencies

### Google Gemini API

The server route makes one model-generation call per valid user submission using the current official Google Gemini JavaScript SDK. The exact SDK method, model identifier, response MIME type, and response schema option must be verified against the current documentation during implementation.

- Service documentation: https://ai.google.dev/gemini-api/docs
- Authentication: server-side API key in an environment variable; never expose it to client code.
- Input: a prompt containing the user's `change` and instructions for a concise, balanced 3–4 scenario UAT response.
- Requested output: a JSON object shaped as `{ "scenarios": [...] }` with the agreed fields.
- Output handling: parse the SDK response, validate the complete object with Zod, and return it only after validation succeeds.
- Cost and limits: verify the current model's free-tier availability, quotas, and rate limits early in the build. Do not hard-code a free-tier guarantee into the app.

No database, authentication provider, hosting platform, or other external service is required.

## Important Failure Modes

- **Empty or invalid request** -> return `400`; the page shows an inline instruction and makes no Gemini call.
- **Gemini request fails or times out** -> return a server error; the page keeps the original input and shows “We couldn’t generate scenarios right now. Please try again.”
- **Gemini returns invalid or incomplete JSON** -> reject the complete response with Zod, return a server error, and do not render partial cards.
- **Repeated click during generation** -> the page disables the button until the request settles.

## What Was Simplified and Why

- **One Next.js project with one API route** instead of separate frontend and backend projects — keeps Codespaces setup and local demonstration simple.
- **Browser-memory state** instead of a database — persistence does not prove the scenario-generation kernel.
- **One Gemini call per submission** instead of streaming, background jobs, or multi-step orchestration — the proof of concept needs a visible result, not infrastructure.
- **Zod validation at the API boundary** instead of a larger data or state framework — one explicit dependency provides reliable runtime checks for the structured response.
- **Cards rendered from a small typed response** instead of a general chat interface or rich editor — consistent structure is the product's distinctive behavior.
- **Local Codespaces demo** instead of deployment — the assignment requires a public repository, and deployment is explicitly out of scope.

## Decisions and Open Issues

### Decisions

- Next.js with TypeScript and one server-side `/api/generate` route — selected for one-project simplicity and the learner's existing Next.js experience.
- Google Gemini with the official JavaScript SDK — selected for low setup overhead and likely low-cost structured generations; current availability is to be verified during implementation.
- Zod — selected for explicit runtime validation of the request and complete model response.
- Object response `{ "scenarios": [...] }` — keeps the top-level contract extensible.
- Request body `{ "change": "..." }` — keeps the client-to-server contract minimal.
- No database, authentication, deployment, or extra service — preserves the small local proof of concept.

### Open Issues

- Verify the current official Gemini SDK package, structured-output API, and free-tier limits during the first build step. The first live request showed that `gemini-2.5-flash` was unavailable to this account, so the default is now `gemini-3.6-flash` and can be overridden with `GEMINI_MODEL`.
- Confirm the exact Next.js and Node.js versions supported in the Codespaces environment.
- Decide the precise error status mapping during implementation while preserving the simple public error shape.

These are implementation verification items, not unresolved product requirements, and do not block the technical plan.
