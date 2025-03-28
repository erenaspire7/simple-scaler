FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint* ./
COPY jest* ./

RUN yarn

COPY apps/services/transcription ./apps/services/transcription
RUN NX_DAEMON=false yarn nx build transcription-service

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/services/transcription /app

RUN yarn

ENTRYPOINT ["node", "main.js"]

CMD []
