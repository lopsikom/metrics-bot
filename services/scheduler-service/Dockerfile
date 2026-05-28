FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY services/scheduler-service/package.json ./services/scheduler-service/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages/shared ./packages/shared
COPY services/scheduler-service ./services/scheduler-service

CMD ["pnpm", "--filter", "scheduler-service", "dev"]