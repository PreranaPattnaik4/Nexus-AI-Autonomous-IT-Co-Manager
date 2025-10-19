'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RcaReportGenerationInputSchema = z.object({
  goal: z.string().describe('The original goal of the task.'),
  logs: z.array(z.string()).describe('An array of execution logs from the task steps.'),
});

const RcaReportGenerationOutputSchema = z.string().describe('A detailed Root Cause Analysis report in Markdown format.');

export type RcaReportGenerationInput = z.infer<typeof RcaReportGenerationInputSchema>;
export type RcaReportGenerationOutput = z.infer<typeof RcaReportGenerationOutputSchema>;

export async function generateRcaReport(input: RcaReportGenerationInput): Promise<RcaReportGenerationOutput> {
  const flow = ai.defineFlow(
    {
      name: 'rcaReportGenerationFlow',
      inputSchema: RcaReportGenerationInputSchema,
      outputSchema: RcaReportGenerationOutputSchema,
    },
    async (input) => {
      const prompt = `
        You are a Root Cause Analysis (RCA) Reporter AI.
        The original task goal was: "${input.goal}"
        The execution logs are as follows:
        ${input.logs.join('\n')}

        Analyze the goal and logs to generate a detailed RCA report in Markdown format.
        The report must include the following sections:
        - ## Summary: A high-level overview of the task and its outcome.
        - ## Root Cause: A detailed analysis of why any failure occurred, or confirmation of success.
        - ## Resolution / Outcome: The final status and any steps taken to mitigate issues.
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
      });

      return llmResponse.text();
    }
  );

  return await flow(input);
}
