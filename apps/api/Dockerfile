# Build stage for this specific app
FROM simple-scaler-base AS builder

WORKDIR /app

COPY --from=simple-scaler-base /app/node_modules ./node_modules
COPY --from=simple-scaler-base /app/libs ./libs

COPY apps/api ./apps/api
RUN NX_DAEMON=false yarn nx build api

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/api /app

RUN yarn

# RUN chown -R node:node /app

EXPOSE 3000
# USER node

ENV NODE_ENV=production


CMD ["node", "main.js"]
