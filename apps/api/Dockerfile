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

COPY apps/api ./apps/api
RUN NX_DAEMON=false yarn nx build api

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist/apps/api /app

RUN yarn

EXPOSE 3000
USER node

ENV NODE_ENV=production

CMD ["node", "main.js"]
