import croneTask from 'Bot/services/croneTask';
import Bot from './Bot/bot'
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
await croneTask.initializeEmitTask(Bot)
Bot.launch()
console.log("Bot is running")
