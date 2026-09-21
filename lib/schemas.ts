import { z } from "zod";

export const changeRequestSchema = z.object({
  change: z.string().trim().min(1),
});

export const scenarioSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  preconditions: z.string().min(1).optional(),
  steps: z.array(z.string().min(1)).min(1),
  expectedResult: z.string().min(1),
});

export const scenariosResponseSchema = z.object({
  scenarios: z.array(scenarioSchema).min(3).max(4),
});

export type Scenario = z.infer<typeof scenarioSchema>;
