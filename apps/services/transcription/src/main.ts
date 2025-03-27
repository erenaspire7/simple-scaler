import * as grpc from '@grpc/grpc-js';
import {
  TranscriptionService,
  YoutubeRequest,
  TranscriptionResponse,
} from '@libs/protos';
import ytdl from '@distube/ytdl-core';

const PORT = process.env.PORT || 4000;

const server = new grpc.Server();

function transcribeYoutube(
  call: grpc.ServerWritableStream<YoutubeRequest, TranscriptionResponse>
) {
  const { url } = call.request;

  const videoStream = ytdl(url);

  videoStream.on('data', (chunk) => {
    call.write({
      type: 'data',
      chunk: chunk.toString('base64'),
    });
  });

  videoStream.on('end', () => {
    // Send end message
    call.write({
      type: 'end',
      message: 'Stream completed',
    });
    call.end();
  });
}

server.addService(TranscriptionService, { transcribeYoutube });

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on ${port}`);
  }
);
