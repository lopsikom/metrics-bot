-- CreateTable
CREATE TABLE "servers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "name" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "server_id" UUID NOT NULL,
    "chat_id" TEXT NOT NULL,
    "messenger" TEXT NOT NULL DEFAULT 'telegram',
    "id" UUID NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "telegram_id" TEXT,
    "max_id" TEXT,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT,
    "login" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_max_id_key" ON "users"("max_id");

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
