FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY services/server-service/package.json ./services/server-service/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages/shared ./packages/shared
COPY services/server-service ./services/server-service
RUN pnpm --filter server-service db:generate

CMD ["pnpm", "--filter", "server-service", "dev"]