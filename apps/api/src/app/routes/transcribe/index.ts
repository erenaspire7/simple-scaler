import { FastifyInstance } from 'fastify';
import { YoutubeRequest } from '../../validation';
import Docker from 'dockerode';

export default async function (fastify: FastifyInstance) {
  const docker = new Docker();

  const registryPrefix = process.env.REGISTRY_PREFIX ?? '';

  const API_BASE_URL =
    process.env.API_BASE_URL ?? 'http://host.docker.internal:3000';

  fastify.post('/youtube', {}, async function (request, reply) {
    const { url } = YoutubeRequest.parse(request.body);

    const callbackUrl = `${API_BASE_URL}/webhooks/transcription`;

    const image = registryPrefix
      ? `${registryPrefix}/transcription-service:latest`
      : `transcription-service:latest`;

    try {
      await docker.run(
        image,
        ['--url', url, '--callback-url', callbackUrl],
        process.stdout
      );
    } catch (error) {
      console.error(error);
      return reply.status(500).send({
        message: 'Failed to start transcription job',
      });
    }

    await reply.status(200).send({
      message: 'Transcription job started',
    });
  });
}
