FROM node:22-alpine

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