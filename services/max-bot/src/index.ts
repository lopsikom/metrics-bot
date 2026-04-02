import { consume, QueueEvent } from "@bot/shared"
import bot from "./bot"

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason)
})

bot.start()
console.log("Max bot is running")

await consume(QueueEvent.MAX_SEND_MESSAGE, async (data) => {
    await bot.api.sendMessageToUser(Number(data.data.id), data.data.message)
})
