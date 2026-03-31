# Проект: Мониторинг серверов через Prometheus

Монорепо на pnpm с микросервисной архитектурой. Сервисы общаются через RabbitMQ.

## Структура

```
services/
  telegram-bot/     — Telegram бот (Telegraf)
  max-bot/          — Max бот (@maxhub/max-bot-api)
  server-service/   — Prisma + PostgreSQL (CRUD пользователей, серверов, задач)
  scheduler-service/ — Cron-уведомления с метриками серверов
  metrics-service/  — Prometheus API + управление конфигами
packages/
  shared/           — RabbitMQ (connection, publisher, consumer, pendingRequests) + типы событий
```

## Запуск

- `pnpm dev` — запуск всех сервисов через tsx
- `pnpm build` — сборка всех сервисов
- Docker: `docker-compose.yml` содержит все сервисы + RabbitMQ + Prometheus

## Ключевые решения

### Поддержка Max мессенджера (добавлено)

- **Prisma схема**: `telegram_id` стал optional (`String?`), добавлен `max_id String? @unique` в `users`, добавлен `messenger String @default("telegram")` в `task`
- **После изменения схемы** обязательно: `npx prisma generate` в `services/server-service/`
- **Shared events**: добавлены `MAX_SEND_MESSAGE`, `PRISMA_GET_USER_BY_MAX_ID` очереди
- **Scheduler-service**: роутинг уведомлений по полю `messenger` задачи — отправляет в `TELEGRAM_SEND_MESSAGE` или `MAX_SEND_MESSAGE`
- **Max-bot**: reply keyboards заменены на inline keyboards (Max не поддерживает reply keyboards). Wizard scenes реализованы через собственный SceneManager (in-memory state machine)
- **ID совместимость**: Telegram ID и Max ID хранятся как строки в разных полях (`telegram_id` / `max_id`), пользователь идентифицируется по одному из двух

### RabbitMQ паттерны

- **Request/Response**: `addPendingRequest()` — генерирует correlationID, слушает ответ на отдельной очереди
- **Fire-and-forget**: `publish()` — односторонняя отправка
- Все типы событий и контракты в `packages/shared/src/events/`

## Переменные окружения

- `RABBITMQ_URL` — для всех сервисов
- `DATABASE_URL` — для server-service и scheduler-service
- `BOT_TOKEN` — для telegram-bot
- `MAX_BOT_TOKEN` — для max-bot
- `PROMETHEUS_URL`, `PATH_CONFIG` — для metrics-service

## Замечания

- `ignoreDeprecations: "6.0"` в tsconfig существующих сервисов вызывает ошибку при `tsc build` (TS 5.x требует `"5.0"`). Сервисы запускаются через `tsx` в dev-режиме, поэтому это не блокирует разработку.
- Схемы Prisma дублируются: `services/server-service/src/prisma/schema.prisma` (основная) и `services/telegram-bot/prisma/schema.prisma` (для типов). Обе нужно обновлять синхронно.
