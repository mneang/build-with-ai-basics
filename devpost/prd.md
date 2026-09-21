---
doc: prd
status: approved
---

# UAT Scenario Generator — Product Requirements

A focused single-page tool for business analysts, QA testers, product managers, developers, and other software-change stakeholders to turn a plain-language change into a concise starting set of structured UAT scenarios.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey

1. The user opens the app and sees the title **UAT Scenario Generator**, a one-sentence explanation, a large text area, a **Generate UAT Scenarios** button, and a small example prompt.
2. The user describes a software change or feature in normal language, without needing to write an AI prompt.
3. The user clicks **Generate UAT Scenarios**.
4. The interface shows that generation is in progress and prevents duplicate submissions.
5. The user sees approximately 3–4 vertically stacked scenarios in the results area.
6. The result set includes one main happy-path scenario and relevant validation, negative, or edge-case scenarios. Each scenario is concise and contains a title, type, relevant preconditions, numbered test steps, and an expected result.
7. The user can edit the input and generate again. The new set replaces the previous set in the same results area.

Success means the output is consistent, readable, and specific enough for a tester to use as a starting point without rewriting everything. It does not need to be perfect or exhaustive.
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## Screens and Layout

There is one responsive page and no navigation, login, sidebar, or secondary workflow.

- A clear page title and one-sentence explanation sit above the main interaction.
- A large text area is the primary input, with placeholder text such as “Describe the software change or feature you want to test…”.
- A **Generate UAT Scenarios** button sits with the input.
- A small example prompt appears beneath the input, such as “Require a reason when a user cancels an order.”
- The results area appears below the input. Before generation it may be empty or show “Your generated scenarios will appear here.”
- Generated scenarios are stacked vertically as separate cards or sections for scanning.

## Look and Feel

The interface should feel lightweight, polished, businesslike, and pleasant rather than overly corporate or playful. Use a clean white or very light background with restrained blue accents, generous spacing, clear hierarchy, soft card borders or light shadows, and modern easy-to-scan typography similar to productivity or developer tools. Avoid gradients, glowing effects, chatbot-style bubbles, and decorative complexity.

## Features and Behavior

### Describe a software change

The user can enter a general-purpose software change or feature in plain language. The tool does not require platform-specific input or knowledge of prompt writing.

### Generate structured scenarios

After a valid submission, the tool returns approximately 3–4 concise scenarios. The set should be balanced rather than repetitive: it should include a primary happy path and, where relevant, validation, negative, or edge-case coverage.

Every scenario includes these core fields:

- Scenario title
- Scenario type, such as Happy Path, Validation, Negative, or Edge Case
- Numbered test steps
- Expected result

Preconditions are optional and appear only when they are relevant to that scenario.

Acceptance criteria:

- [ ] A plain-language change produces approximately 3–4 readable scenarios in the results area.
- [ ] Every scenario consistently includes a title, scenario type, numbered test steps, and expected result.
- [ ] Preconditions appear only when relevant and are not required on every scenario.
- [ ] The set includes a happy-path scenario and relevant non-happy-path coverage rather than only happy-path variations.
- [ ] The steps and expected results are specific enough to provide a practical UAT starting point.
- [ ] A second generation replaces the prior results in the same area with only the latest generated set.

## States and Boundaries

- **First use** — The page shows the input controls, example prompt, and an empty or instructional results area. No scenarios are shown.
- **Generating** — The generate button is disabled and its label changes to a loading state such as “Generating…”. The user cannot submit repeatedly. Previous results may remain visible until the new result is ready, or the results area may show a loading state.
- **Successful generation** — The latest 3–4 scenarios replace any previous results and are shown as vertically stacked cards or sections.
- **Empty input** — No request is made. An inline message near the text area says, for example, “Please describe a software change or feature first.”
- **Generation error** — The results area shows a clear non-technical message such as “We couldn’t generate scenarios right now. Please try again.” The original input remains available for retry.
- **Repeat generation** — The user edits the existing input and generates again; only the latest completed result set remains visible. No separate clear or reset action is required.
- **Persistence** — Nothing needs to be saved between sessions. Accounts, saved projects, and history are outside the proof of concept.

## Product Decisions

- General-purpose rather than Salesforce-specific — Salesforce is the learner’s familiar domain, but platform-specific functionality would narrow the experiment.
- One page and one core action — the proof of concept is intended to be understandable and demonstrable within a short exercise.
- Approximately 3–4 scenarios — enough to demonstrate balanced coverage without producing an essay.
- Structured scenario fields — predictable formatting is the key difference from an unstructured chatbot response.
- Human review remains part of the workflow — the tool provides a strong starting point and does not promise perfect or exhaustive UAT coverage.
- No clear/reset action — editing the input and generating again is sufficient for the small workflow.

## What We're Building

- A single responsive page for entering a software change.
- A clear title, explanation, placeholder, example prompt, and generate action.
- A structured results area with approximately 3–4 concise scenario cards or sections.
- Balanced happy-path and relevant validation, negative, or edge-case scenarios.
- Loading, empty-input validation, generation-error, and repeat-generation behavior.
- A restrained, professional visual presentation that supports scanning.

## Deferred From the POC

- Accounts, saved projects, and history are deferred because persistence is not needed to prove the generation loop.
- Collaboration is deferred because the prototype has one user and one immediate result.
- Jira, Salesforce, and other integrations are deferred because the generator should demonstrate general-purpose scenario creation independently.
- Exporting, editing, tagging, and richer result management are deferred because the initial output only needs to be a usable starting point.

## Possible Later Enhancements

The tool could later support editing and exporting scenarios, saved project history, collaboration, platform or domain context, integrations with work-management tools, and more configurable scenario coverage.

## Non-Goals

- It will not replace tester or stakeholder judgment.
- It will not guarantee exhaustive or production-ready UAT coverage.
- It will not require users to understand prompt engineering.
- It will not include authentication, persistence, collaboration, or external integrations in this proof of concept.
- It will not be tied to Salesforce or another single software platform.

## Open Questions

- The exact generation service and implementation approach are intentionally deferred to `4-spec`; this does not block product approval.
- Exact wording, card styling, and responsive breakpoints can be refined during the technical plan and build as long as the stated behavior and visual direction remain intact.
