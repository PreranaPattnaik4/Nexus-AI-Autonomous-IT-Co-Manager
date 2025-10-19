'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CommandSimulationInputSchema = z.string().describe('A shell command to simulate.');
const CommandSimulationOutputSchema = z.string().describe('The simulated output of the command.');

export type CommandSimulationInput = z.infer<typeof CommandSimulationInputSchema>;
export type CommandSimulationOutput = z.infer<typeof CommandSimulationOutputSchema>;

export async function simulateCommand(command: CommandSimulationInput): Promise<CommandSimulationOutput> {
  const flow = ai.defineFlow(
    {
      name: 'commandSimulationFlow',
      inputSchema: CommandSimulationInputSchema,
      outputSchema: CommandSimulationOutputSchema,
    },
    async (command) => {
      const prompt = `
        You are a Linux terminal. Provide a realistic, simulated output for the following command.
        Do not explain the command, just provide the output as if you were the shell.
        
        Command: ${command}
      `;

      const llmResponse = await ai.generate({
        prompt,
        model: 'gemini-1.5-pro',
      });

      return llmResponse.text();
    }
  );

  return await flow(command);
}
