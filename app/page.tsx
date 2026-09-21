"use client";

import { FormEvent, useState } from "react";
import type { Scenario } from "@/lib/schemas";

export default function Home() {
  const [change, setChange] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [inputError, setInputError] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!change.trim()) {
      setInputError("Please describe a software change or feature first.");
      return;
    }

    setInputError("");
    setGenerationError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setScenarios(data.scenarios);
    } catch {
      setGenerationError("We couldn't generate scenarios right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">UAT WORKBENCH</p>
        <h1>UAT Scenario Generator</h1>
        <p className="intro">
          Turn a plain-language software change into a concise, structured starting point for user acceptance testing.
        </p>
      </section>

      <form className="generator-form" onSubmit={handleSubmit}>
        <label htmlFor="change">What are you changing?</label>
        <textarea
          id="change"
          value={change}
          onChange={(event) => {
            setChange(event.target.value);
            setInputError("");
            setGenerationError("");
          }}
          placeholder="Describe the software change or feature you want to test..."
          rows={6}
        />
        {inputError && <p className="inline-error" role="alert">{inputError}</p>}
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate UAT Scenarios"}
        </button>
        <p className="example">
          <span>Try an example:</span> Require a reason when a user cancels an order.
        </p>
      </form>

      <section className="results" aria-live="polite">
        <div className="section-heading">
          <p className="eyebrow">GENERATED COVERAGE</p>
          <h2>Your UAT scenarios</h2>
        </div>
        {generationError ? (
          <p className="generation-error" role="alert">{generationError}</p>
        ) : scenarios.length === 0 ? (
          <p className="empty-state">Your generated scenarios will appear here.</p>
        ) : (
          <div className="scenario-list">
            {scenarios.map((scenario, index) => (
              <article className="scenario-card" key={`${scenario.title}-${index}`}>
                <div className="card-heading">
                  <div>
                    <p className="scenario-number">SCENARIO {String(index + 1).padStart(2, "0")}</p>
                    <h3>{scenario.title}</h3>
                  </div>
                  <span className="type-tag">{scenario.type}</span>
                </div>
                {scenario.preconditions && (
                  <div className="detail-block">
                    <h4>Preconditions</h4>
                    <p>{scenario.preconditions}</p>
                  </div>
                )}
                <div className="detail-block">
                  <h4>Test steps</h4>
                  <ol>
                    {scenario.steps.map((step) => (
                      <li key={step}>{step.replace(/^\s*\d+[.)]\s*/, "")}</li>
                    ))}
                  </ol>
                </div>
                <div className="expected-result">
                  <h4>Expected result</h4>
                  <p>{scenario.expectedResult}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
