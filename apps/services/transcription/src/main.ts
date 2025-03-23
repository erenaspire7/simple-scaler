import * as grpc from '@grpc/grpc-js';
import { TranscriptionService } from '@libs/protos';

const PORT = process.env.PORT || 4000;

const server = new grpc.Server();

function transcribeVideo(call, callback) {
  console.log(call);
}

server.addService(TranscriptionService, { transcribeVideo });

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
