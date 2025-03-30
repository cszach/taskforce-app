import { z } from "zod";

export const PromptSchema = z.object({
  prompt: z.string().min(1),
});

export type PromptType = z.infer<typeof PromptSchema>;
