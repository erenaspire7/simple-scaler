FROM node:22-alpine AS deps

# Install protobuf compiler
RUN apk add --no-cache protobuf

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache for dependencies
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint* ./
COPY jest* ./

RUN yarn

COPY libs/ ./libs/

# generate proto typescript files
RUN yarn nx build-types protos

# Build stage for this specific app
FROM deps AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/libs ./libs

COPY apps/services/stream ./apps/services/stream
RUN NX_DAEMON=false yarn nx build stream-service

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/services/stream /app

RUN yarn

EXPOSE 4000
USER node

ENV NODE_ENV=production

CMD ["node", "main.js"]
