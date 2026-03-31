import { consume, publish, QueueEvent } from "@bot/shared";
import croneTask from "./croneTask";

await croneTask.initializeEmitTask()

console.log("crone service is running");

await consume(QueueEvent.CRON_EMIT_TASK, async (data) => {
    await croneTask.emitTask(data.data.host, data.data.server_id, data.data.first_name, data.data.chat_id, data.data.interval, data.data.name, data.data.messenger ?? "telegram")
})
await consume(QueueEvent.CRON_UN_EMIT_TASK, async (data) => {
    const response = await croneTask.unEmitTask(data.data);
    await publish<QueueEvent.CRON_UN_EMIT_TASK_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})