import { z } from 'zod';

export const TranscribeYoutubeRequest = z.object({
  url: z.string(),
});

export type TranscribeYoutube = z.infer<typeof TranscribeYoutubeRequest>;

export const TranscribeVideoRequest = z.object({
  data: z.string(),
});

export type TranscribeVideo = z.infer<typeof TranscribeVideoRequest>;
