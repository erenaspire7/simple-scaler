import { z } from 'zod';

export const TranscribeYoutubeRequest = z.object({
  url: z.string(),
});
