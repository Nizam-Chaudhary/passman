# Base stage
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY pnpm-lock.yaml package.json /app/
RUN pnpm fetch
COPY . .

# Install prod dependencies
FROM base AS prod-deps
RUN pnpm install -r --offline --prod

# Build project
FROM base AS builder
RUN pnpm install -r --offline
RUN pnpm run build

# Main stage
FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json drizzle.config.ts rds-ca-rsa2048-g1.pem deploy.sh /app/
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=builder /app/dist dist
EXPOSE 3000
ENTRYPOINT [ "pnpm", "start" ]
