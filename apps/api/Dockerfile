FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod
ADD . .
RUN pnpm deploy --filter=api --prod /prod/api

FROM oven/bun:latest AS api
COPY --from=prod /prod/api /prod/api
WORKDIR /prod/api
USER bun
EXPOSE 3000/tcp
CMD [ "bun", "start" ]
