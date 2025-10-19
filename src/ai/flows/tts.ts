'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

const TtsInputSchema = z.string();
const TtsOutputSchema = z.object({
  media: z.string().describe("The Base64 encoded WAV audio data URI."),
});

export type TtsInput = z.infer<typeof TtsInputSchema>;
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function generateAudio(text: TtsInput): Promise<TtsOutput> {
  const flow = ai.defineFlow(
    {
      name: 'ttsFlow',
      inputSchema: TtsInputSchema,
      outputSchema: TtsOutputSchema,
    },
    async (query) => {
      const { media } = await ai.generate({
        model: 'gemini-1.5-flash-preview-001/models/text-to-speech',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: query,
      });

      if (!media) {
        throw new Error('No media returned from TTS model');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);

      return {
        media: 'data:audio/wav;base64,' + wavBase64,
      };
    }
  );

  return await flow(text);
}
