# UAT Scenario Generator

A focused Next.js proof of concept that turns a plain-language software change into a concise set of structured UAT scenarios.

## Run Locally in Codespaces

Requirements:

- Node.js 24 or another version supported by the current Next.js release
- A Google Gemini API key for live generation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and replace `your_gemini_api_key_here` with your Gemini API key. Keep this file private. It is ignored by Git.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the forwarded port shown by Codespaces, normally port `3000`.

`GEMINI_MODEL` defaults to `gemini-3.6-flash`. Change it in `.env.local` if a different current model is available to your account.

## Try It

Enter a change such as:

> Require a reason when a user cancels an order.

Click **Generate UAT Scenarios**. The app returns approximately 3–4 scenario cards with a title, scenario type, numbered steps, expected result, and optional preconditions when relevant.

The app intentionally does not include accounts, saved projects, a database, integrations, or deployment configuration. It is designed for a simple local demo and public repository review.

## Validate the Project

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## API Contract

The browser sends the software change to the server-side route:

```http
POST /api/generate
Content-Type: application/json
```

```json
{
  "change": "Require a reason when a user cancels an order."
}
```

A successful response has this shape:

```json
{
  "scenarios": [
    {
      "title": "Cancel an order with a reason",
      "type": "Happy Path",
      "steps": ["Start the cancellation", "Provide a reason", "Confirm the action"],
      "expectedResult": "The cancellation is completed and the reason is saved."
    }
  ]
}
```

The API validates requests and Gemini responses with Zod. The Gemini key is used only by the server route and is never sent to the browser.
