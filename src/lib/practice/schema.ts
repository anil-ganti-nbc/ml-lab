import { z } from "zod";

export const PRACTICE_SCHEMA_VERSION = 1 as const;
export const PRACTICE_SOURCE_DAU = "dau" as const;
export const PRACTICE_SOURCE_ML = "ml-lab" as const;
export const PRACTICE_RESULT_MESSAGE = "ml-lab:practice-result" as const;

/** DAU concept ids for this family. */
export const mlConceptIdSchema = z
  .string()
  .regex(/^ml-[a-z0-9]+(?:-[a-z0-9]+)*$/, "conceptId must be a DAU ml-* id");

/** DAU lessons are `{conceptId}-{5|10|20|30}`. */
export const mlLessonIdSchema = z
  .string()
  .regex(
    /^ml-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/,
    "lessonId must be {conceptId}-{5|10|20|30}",
  );

export const ML_PRACTICE_TYPES = [
  "gradient",
  "traineval",
  "neuron",
  "attention",
  "scenarios",
  "free"
] as const;

export type PlPracticeType = (typeof ML_PRACTICE_TYPES)[number];

const practiceTypeSchema = z.enum(ML_PRACTICE_TYPES);

export const practicePayloadSchema = z
  .object({
    schemaVersion: z.literal(PRACTICE_SCHEMA_VERSION),
    sourceApp: z.literal(PRACTICE_SOURCE_DAU),
    conceptId: mlConceptIdSchema,
    lessonId: mlLessonIdSchema,
    practiceType: practiceTypeSchema,
    goal: z.string().trim().min(8).max(240),
    parameters: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((value) => value.lessonId.startsWith(`${value.conceptId}-`), {
    message: "lessonId must be {conceptId}-{duration}",
    path: ["lessonId"],
  });

export const practiceResultSchema = z.object({
  schemaVersion: z.literal(PRACTICE_SCHEMA_VERSION),
  sourceApp: z.literal(PRACTICE_SOURCE_ML),
  conceptId: mlConceptIdSchema,
  lessonId: mlLessonIdSchema,
  completed: z.boolean(),
  attempts: z.number().int().min(0),
  timeSpentMs: z.number().int().min(0),
  selfRating: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type PracticePayload = z.infer<typeof practicePayloadSchema>;
export type PracticeResult = z.infer<typeof practiceResultSchema>;
export type SelfRating = 1 | 2 | 3;

export type PracticeParseOk<T> = { ok: true; value: T };
export type PracticeParseErr = { ok: false; error: string };
export type PracticeParse<T> = PracticeParseOk<T> | PracticeParseErr;

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "payload";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function parsePracticePayload(input: unknown): PracticeParse<PracticePayload> {
  const result = practicePayloadSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, error: formatZodError(result.error) };
  }
  return { ok: true, value: result.data };
}

export function parsePracticeResult(input: unknown): PracticeParse<PracticeResult> {
  const result = practiceResultSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, error: formatZodError(result.error) };
  }
  return { ok: true, value: result.data };
}

export function buildPracticeResult(input: {
  conceptId: string;
  lessonId: string;
  completed: boolean;
  attempts: number;
  timeSpentMs: number;
  selfRating?: SelfRating;
}): PracticeParse<PracticeResult> {
  return parsePracticeResult({
    schemaVersion: PRACTICE_SCHEMA_VERSION,
    sourceApp: PRACTICE_SOURCE_ML,
    conceptId: input.conceptId,
    lessonId: input.lessonId,
    completed: input.completed,
    attempts: input.attempts,
    timeSpentMs: input.timeSpentMs,
    ...(input.selfRating ? { selfRating: input.selfRating } : {}),
  });
}
