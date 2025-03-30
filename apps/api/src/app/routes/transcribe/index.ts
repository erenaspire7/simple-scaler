import { FastifyInstance } from 'fastify';
import { YoutubeRequest } from '../../validation';
import Docker from 'dockerode';

const docker = new Docker();

// Create task executor strategies
const taskExecutors = {
  // Swarm strategy
  swarm: async (image, args, networks) => {
    const serviceConfig = {
      Name: `task-${Date.now()}`,
      TaskTemplate: {
        ContainerSpec: {
          Image: image,
          Args: args,
        },
        RestartPolicy: {
          Condition: 'none',
        },
        Resources: {
          Limits: {
            MemoryBytes: 1024 * 1024 * 512,
            NanoCPUs: 500000000,
          },
        },
      },
      Networks: networks.map((n: string) => ({ Target: n })),
      Mode: {
        Replicated: {
          Replicas: 1,
        },
      },
    };

    return docker.createService(serviceConfig);
  },

  // Local Docker strategy
  local: (image, args, networks) => {
    return docker.run(image, args, process.stdout, {
      NetworkingConfig: networks?.length
        ? { EndpointsConfig: Object.fromEntries(networks.map((n) => [n, {}])) }
        : {},
      HostConfig: {
        AutoRemove: true,
      },
    });
  },
};

const getTaskExecutor = async () => {
  try {
    return Boolean(process.env.IS_SWARM ?? false)
      ? taskExecutors.swarm
      : taskExecutors.local;
  } catch (error) {
    console.log('Error checking Docker environment, using local executor');
    return taskExecutors.local;
  }
};

export default async function (fastify: FastifyInstance) {
  const API_BASE_URL =
    process.env.API_BASE_URL ?? 'http://host.docker.internal:3000';

  fastify.post('/youtube', {}, async function (request, reply) {
    const { url } = YoutubeRequest.parse(request.body);

    const callbackUrl = `${API_BASE_URL}/webhooks/transcription`;

    try {
      const executor = await getTaskExecutor();

      await executor(
        process.env.TRANSCRIPTION_SERVICE_IMAGE,
        ['--url', url, '--callback-url', callbackUrl],
        [process.env.NETWORK]
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
