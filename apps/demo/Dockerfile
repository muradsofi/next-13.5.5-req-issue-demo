# For instructions on how to build and run this Docker image,
# please check the 'Using Docker' section in the README file.

# Base stage for common setup
FROM node:20 as base

ARG BUILD_REPOSITORY
ENV BUILD_REPOSITORY=${BUILD_REPOSITORY}

ARG BUILD_GIT_COMMIT
ENV BUILD_GIT_COMMIT=${BUILD_GIT_COMMIT}

ARG BUILD_IMAGE_NAME
ENV BUILD_IMAGE_NAME=${BUILD_IMAGE_NAME}

ARG BUILD_IMAGE_TAG
ENV BUILD_IMAGE_TAG=${BUILD_IMAGE_TAG}

# Update and install necessary libraries for 'canvas' package
RUN apt-get update && apt-get install -y \
    build-essential libcairo2-dev libpango1.0-dev \
    libjpeg-dev libgif-dev librsvg2-dev

# Builder stage for building the application
FROM base AS builder
WORKDIR /app
ENV APP_NAME=demo

# Install turbo globally
RUN npm install -g turbo

# Copy the application source code
COPY . .

# Prune and prepare for production
RUN turbo prune --scope=${APP_NAME} --docker

# Installer stage for dependencies
FROM base as installer
WORKDIR /app
ENV APP_NAME=demo

# Install pnpm and turbo globally
RUN npm install -g pnpm@8 turbo

# Install dependencies, leveraging caching
COPY .gitignore .
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Copy the full build output from builder stage
COPY --from=builder /app/out/full/ .
COPY turbo.json .

# Build the project
RUN turbo run build --filter=${APP_NAME}

# Runner stage for running the application
FROM base AS runner
WORKDIR /app
ENV APP_NAME=demo

# Install pnpm globally
RUN npm install -g pnpm@8

# Copy the built application from the installer stage
COPY --from=installer /app .

# Start the application (consider using the pnpm script)
CMD pnpm --filter "${APP_NAME}" run start
