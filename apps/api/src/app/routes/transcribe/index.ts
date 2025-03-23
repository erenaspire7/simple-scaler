import { FastifyInstance } from 'fastify';
import * as grpc from '@grpc/grpc-js';
// import { TranscribeVideoRequest, TranscribeVideo } from './validation';
import { TranscriptionClient } from '@libs/protos';

export default async function (fastify: FastifyInstance) {
  const transcriptionClient = new TranscriptionClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );

  fastify.post(
    '/upload',
    {
      config: { stream: true },
    },
    async function (request, reply) {
      const uploadId = crypto.randomUUID();

      console.log("Transcribing video with ID:", uploadId);

      const call = transcriptionClient.transcribeVideo((error, response) => {
        if (error) {
          console.error('Transcription error:', error);
          // Handle the error appropriately
        } else {
          // Handle successful response
          console.log('Transcription completed:', response.message);
        }
      });

      // Process incoming chunks and send to gRPC
      for await (const chunk of request.raw) {
        const videoChunk = {
          data: chunk,
          uploadId,
        };

        // Write chunk to gRPC stream
        const canContinue = call.write(videoChunk);

        if (!canContinue) {
          // Handle backpressure
          await new Promise((resolve) => call.once('drain', resolve));
        }
      }

      call.end();

      return { message: 'Hello API' };
    }
  );
}
