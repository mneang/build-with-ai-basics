import { GoogleGenAI, Type, type Schema } from "@google/genai";

const scenarioResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scenarios: {
      type: Type.ARRAY,
      minItems: "3",
      maxItems: "4",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING },
          preconditions: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          expectedResult: { type: Type.STRING },
        },
        required: ["title", "type", "steps", "expectedResult"],
      },
    },
  },
  required: ["scenarios"],
};

export async function generateScenarios(change: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    contents: `Create UAT scenarios for this software change:\n\n${change}`,
    config: {
      systemInstruction:
        "You generate concise, practical UAT scenarios. Return one happy path and relevant validation, negative, or edge-case scenarios. Every scenario must have a title, type, numbered test steps, and expected result. Include preconditions only when relevant. Do not add commentary outside the requested JSON object.",
      responseMimeType: "application/json",
      responseSchema: scenarioResponseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(text);
}
