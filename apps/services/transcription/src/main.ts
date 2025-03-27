import * as grpc from '@grpc/grpc-js';
import {
  TranscriptionService,
  YoutubeRequest,
  TranscriptionResponse,
} from '@libs/protos';

const PORT = process.env.PORT || 4000;

const server = new grpc.Server();

function transcribeYoutube(
  call: grpc.ServerWritableStream<YoutubeRequest, TranscriptionResponse>
) {
  const { url } = call.request;

  // get youtube metadata
  // drop an event and wait for it to complete through direct ollama call
  

  console.log(url);
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
