FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY services/metrics-service/package.json ./services/metrics-service/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY packages/shared ./packages/shared
COPY services/metrics-service ./services/metrics-service

CMD ["pnpm", "--filter", "metrics-service", "dev"]