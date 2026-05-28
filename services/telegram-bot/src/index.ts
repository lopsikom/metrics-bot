import { consume, QueueEvent } from '@bot/shared';
import Bot from './Bot/bot'
import handlersCollector from './Bot/services/handlersCollector';
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
handlersCollector.initHandlers(Bot)
Bot.launch()
console.log("Bot is running")

await consume(QueueEvent.TELEGRAM_SEND_MESSAGE, async (data) => {
    await Bot.telegram.sendMessage(data.data.id, data.data.message)
})
