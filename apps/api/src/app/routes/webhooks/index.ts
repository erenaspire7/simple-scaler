import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.post('/transcription', {}, async function (request, reply) {
    // @ts-ignore
    const { transcription } = JSON.parse(request.body);

    console.log(transcription);
  });
}
