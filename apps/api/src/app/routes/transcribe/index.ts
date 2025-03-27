import { FastifyInstance } from 'fastify';
import * as grpc from '@grpc/grpc-js';
import { TranscribeYoutubeRequest } from './validation';
import { TranscriptionClient } from '@libs/protos';

export default async function (fastify: FastifyInstance) {
  const TRANSCRIPTION_SERVICE_URL =
    process.env.TRANSCRIPTION_SERVICE_URL || 'localhost:4000';

  const transcriptionClient = new TranscriptionClient(
    TRANSCRIPTION_SERVICE_URL,
    grpc.credentials.createInsecure()
  );

  fastify.post('/youtube', {}, async function (request, reply) {
    const { url } = TranscribeYoutubeRequest.parse(request.body);

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    let hasEnded = false;

    const call = transcriptionClient.transcribeYoutube({ url });

    call.on('data', (response) => {
      if (!hasEnded) {
        reply.raw.write(`data: ${JSON.stringify(response)}\n\n`);
      }
    });

    call.on('end', () => {
      if (!hasEnded) {
        reply.raw.write('data: [END]\n\n');
        reply.raw.end();
        hasEnded = true;
      }
    });

    call.on('error', (error) => {
      if (!hasEnded) {
        console.error('gRPC stream error:', error);
        reply.raw.write(
          `data: ${JSON.stringify({ error: error.message })}\n\n`
        );
        reply.raw.end();
        hasEnded = true;
      }
    });
  });
}
