# Build stage for this specific app
FROM simple-scaler-base AS builder

WORKDIR /app

COPY --from=simple-scaler-base /app/node_modules ./node_modules
COPY --from=simple-scaler-base /app/libs ./libs

COPY apps/services/stream ./apps/services/stream
RUN NX_DAEMON=false yarn nx build stream-service

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/services/stream /app

RUN yarn

RUN chown -R node:node /app

EXPOSE 4000
USER node

ENV NODE_ENV=production

CMD ["node", "main.js"]
