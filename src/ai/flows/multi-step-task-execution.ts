'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TaskStepSchema = z.object({
  description: z.string().describe('A single, clear, technical step to be executed.'),
});

const MultiStepTaskExecutionInputSchema = z.string().describe('A high-level user goal.');

const MultiStepTaskExecutionOutputSchema = z.object({
  goal: z.string().describe("The user's original goal."),
  steps: z.array(TaskStepSchema).describe('The array of technical steps to achieve the goal.'),
});

export type MultiStepTaskExecutionInput = z.infer<typeof MultiStepTaskExecutionInputSchema>;
export type MultiStepTaskExecutionOutput = z.infer<typeof MultiStepTaskExecutionOutputSchema>;

export async function multiStepTaskExecution(goal: MultiStepTaskExecutionInput): Promise<MultiStepTaskExecutionOutput> {
  const flow = ai.defineFlow(
    {
      name: 'multiStepTaskExecutionFlow',
      inputSchema: MultiStepTaskExecutionInputSchema,
      outputSchema: MultiStepTaskExecutionOutputSchema,
    },
    async (goal) => {
      const prompt = `
        You are an expert IT Project Manager AI. Your job is to take a high-level goal from a user and break it down into a sequence of clear, technical, and actionable steps.
        
        The user's goal is: "${goal}"

        Generate a list of steps to accomplish this. Each step should be a single command or action.
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
        output: {
          schema: MultiStepTaskExecutionOutputSchema,
        },
      });

      return llmResponse.output()!;
    }
  );

  return await flow(goal);
}
