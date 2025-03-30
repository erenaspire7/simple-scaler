import { z } from 'zod';

export const YoutubeRequest = z.object({
  url: z.string(),
});

export const TranscriptionResponse = z.object({
  transcription: z.string(),
});
