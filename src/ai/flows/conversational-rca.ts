'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getTasksByStatus,
  getSystemHealth,
  getRcaReportSummary,
} from '@/lib/firestore-helpers';

// Tools
const getTasksByStatusTool = ai.defineTool(
  {
    name: 'getTasksByStatus',
    description: 'Get a list of tasks with a given status (in-progress, completed, or failed).',
    inputSchema: z.object({ status: z.enum(['in-progress', 'completed', 'failed']) }),
    outputSchema: z.any(),
  },
  async ({ status }) => getTasksByStatus(status)
);

const getSystemHealthTool = ai.defineTool(
  {
    name: 'getSystemHealth',
    description: 'Get the current health status of all monitored systems.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => getSystemHealth()
);

const getRcaReportSummaryTool = ai.defineTool(
  {
    name: 'getRcaReportSummary',
    description: 'Get a summary of a Root Cause Analysis report for a given task ID.',
    inputSchema: z.object({ taskId: z.string() }),
    outputSchema: z.any(),
  },
  async ({ taskId }) => getRcaReportSummary(taskId)
);

const ConversationalRcaInputSchema = z.string();
const ConversationalRcaOutputSchema = z.string();

export type ConversationalRcaInput = z.infer<typeof ConversationalRcaInputSchema>;
export type ConversationalRcaOutput = z.infer<typeof ConversationalRcaOutputSchema>;

export async function askRca(query: ConversationalRcaInput): Promise<ConversationalRcaOutput> {
  const flow = ai.defineFlow(
    {
      name: 'conversationalRcaFlow',
      inputSchema: ConversationalRcaInputSchema,
      outputSchema: ConversationalRcaOutputSchema,
    },
    async (query) => {
      const prompt = `
        You are a System Health AI Assistant. Your job is to answer user questions about tasks, system health, and RCA reports.
        Use the available tools to query the necessary data from Firestore to answer the user's question.

        User query: "${query}"
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
        tools: [getTasksByStatusTool, getSystemHealthTool, getRcaReportSummaryTool],
      });

      return llmResponse.text();
    }
  );
  return await flow(query);
}
