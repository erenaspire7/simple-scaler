import { FastifyInstance } from 'fastify';
import { TranscriptionResponse } from '../../validation';

export default async function (fastify: FastifyInstance) {
  fastify.post('/transcription', {}, async function (request, reply) {
    const { transcription } = TranscriptionResponse.parse(request.body);

    console.log(transcription);
  });
}
