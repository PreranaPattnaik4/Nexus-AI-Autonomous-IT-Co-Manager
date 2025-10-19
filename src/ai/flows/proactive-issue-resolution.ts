'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProactiveIssueResolutionInputSchema = z.object({
  title: z.string().describe('The title of the alert.'),
  description: z.string().describe('The description of the alert.'),
});

const ProactiveIssueResolutionOutputSchema = z.object({
  goal: z.string().describe('A high-level goal to resolve the issue.'),
});

export type ProactiveIssueResolutionInput = z.infer<typeof ProactiveIssueResolutionInputSchema>;
export type ProactiveIssueResolutionOutput = z.infer<typeof ProactiveIssueResolutionOutputSchema>;

export async function proactiveIssueResolution(
  input: ProactiveIssueResolutionInput
): Promise<ProactiveIssueResolutionOutput> {
  const flow = ai.defineFlow(
    {
      name: 'proactiveIssueResolutionFlow',
      inputSchema: ProactiveIssueResolutionInputSchema,
      outputSchema: ProactiveIssueResolutionOutputSchema,
    },
    async (input) => {
      const prompt = `
        You are a Proactive IT Resolution AI. You have received the following alert:
        Title: ${input.title}
        Description: ${input.description}

        Formulate a high-level, actionable goal to diagnose and resolve this issue.
        For example, if the alert is about "High CPU", a good goal would be "Diagnose and fix high CPU on the specified server."
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
        output: {
          schema: ProactiveIssueResolutionOutputSchema,
        },
      });

      return llmResponse.output()!;
    }
  );

  return await flow(input);
}
