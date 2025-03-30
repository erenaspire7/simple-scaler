FROM simple-scaler-base AS builder

WORKDIR /app

COPY apps/services/transcription ./apps/services/transcription
RUN NX_DAEMON=false yarn nx build transcription-service

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/services/transcription /app

RUN yarn
RUN chown -R node:node /app

ENTRYPOINT ["node", "main.js"]

CMD []
