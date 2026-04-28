FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared-redis/package.json ./packages/shared-redis/
COPY services/telegram-bot/package.json ./services/telegram-bot/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY packages/shared-redis ./packages/shared-redis
COPY services/telegram-bot ./services/telegram-bot

CMD ["pnpm", "--filter", "telegram-bot", "dev"]