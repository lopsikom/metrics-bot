import croneTask from 'Bot/services/croneTask';
import Bot from './Bot/bot'
import handlersCollector from 'Bot/services/handlersCollector';
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
handlersCollector.initHandlers(Bot)
await croneTask.initializeEmitTask(Bot)
Bot.launch()
console.log("Bot is running")
