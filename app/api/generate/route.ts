import { NextResponse } from "next/server";
import { generateScenarios } from "@/lib/gemini";
import { changeRequestSchema, scenariosResponseSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = changeRequestSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json(
      { error: "Please describe a software change or feature first." },
      { status: 400 },
    );
  }

  try {
    const generated = await generateScenarios(input.data.change);
    const result = scenariosResponseSchema.safeParse(generated);

    if (!result.success) {
      throw new Error("Gemini returned an invalid scenario response");
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Scenario generation failed", error);
    return NextResponse.json(
      { error: "We couldn't generate scenarios right now. Please try again." },
      { status: 500 },
    );
  }
}
