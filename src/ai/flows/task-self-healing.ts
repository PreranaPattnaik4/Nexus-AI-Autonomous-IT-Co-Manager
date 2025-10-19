'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TaskSelfHealingInputSchema = z.object({
  goal: z.string().describe('The original goal of the failed task.'),
  failureLog: z.string().describe('The error log or message from the failure.'),
});

const TaskSelfHealingOutputSchema = z.object({
  goal: z.string().describe('The new, corrected goal to retry the task.'),
});

export type TaskSelfHealingInput = z.infer<typeof TaskSelfHealingInputSchema>;
export type TaskSelfHealingOutput = z.infer<typeof TaskSelfHealingOutputSchema>;

export async function taskSelfHealing(input: TaskSelfHealingInput): Promise<TaskSelfHealingOutput> {
  const flow = ai.defineFlow(
    {
      name: 'taskSelfHealingFlow',
      inputSchema: TaskSelfHealingInputSchema,
      outputSchema: TaskSelfHealingOutputSchema,
    },
    async (input) => {
      const prompt = `
        You are an AI with self-healing capabilities. A task you were assigned has failed.
        Your original goal was: "${input.goal}"
        The failure log is: "${input.failureLog}"

        Analyze the failure and formulate a new, corrected goal that acknowledges the failure and attempts a different approach.
        For example, if the original goal was "Reboot server" and the log was "Connection timed out", a good new goal would be:
        "[Self-Correction] The previous attempt to reboot the server failed. Force restart the VM from the hypervisor and verify its status."
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
        output: {
          schema: TaskSelfHealingOutputSchema,
        },
      });

      return llmResponse.output()!;
    }
  );

  return await flow(input);
}
