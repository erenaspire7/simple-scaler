import { z } from 'zod';

export const YoutubeRequest = z.object({
  url: z.string(),
});
