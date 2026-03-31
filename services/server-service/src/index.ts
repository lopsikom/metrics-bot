import { publish, consume, QueueEvent } from '@bot/shared'
import * as prisma from "./prisma/prismaClient"

await consume(QueueEvent.PRISMA_ADD_SERVER, async (data) => {
    const response = await prisma.addServer(data.data.user_id, data.data.name, data.data.host)
    await publish<QueueEvent.PRISMA_ADD_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_USER_BY_ID, async (data) => {
    const response = await prisma.getUserById(data.data);
    await publish<QueueEvent.PRISMA_GET_USER_BY_ID_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_CREATE_NEW_USER, async (data) => {
    const response = await prisma.createNewUser(data.data.telegram_id, data.data.first_name, data.data.second_name, data.data.login, data.data.max_id)
    await publish<QueueEvent.PRISMA_CREATE_NEW_USER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_USER_BY_TGID, async (data) => {
    const response = await prisma.getUserByTgId(data.data);
    await publish<QueueEvent.PRISMA_GET_USER_BY_TGID_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_USER_BY_MAX_ID, async (data) => {
    const response = await prisma.getUserByMaxId(data.data);
    await publish<QueueEvent.PRISMA_GET_USER_BY_MAX_ID_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_SERVERS_COUNT, async (data) => {
    const response = await prisma.getServersCountUser(data.data)
    await publish<QueueEvent.PRISMA_GET_SERVERS_COUNT_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_USER_SERVER, async (data) => {
    const response = await prisma.getUserServers(data.data);
    await publish<QueueEvent.PRISMA_GET_USER_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data: response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_GET_SERVER, async (data) => {
    const response = await prisma.getServer(data.data);
    await publish<QueueEvent.PRISMA_GET_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})
await consume(QueueEvent.PRISMA_CHANGE_SERVER, async(data) => {
    const response = await prisma.changeDataServer(data.data.id, data.data.data)
    await publish<QueueEvent.PRISMA_CHANGE_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PRISMA_DELETE_SERVER, async(data) => {
    const response = await prisma.deleteServer(data.data);
    await publish<QueueEvent.PRISMA_DELETE_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})
await consume(QueueEvent.PRISMA_ADD_TASK, async(data) => {
    const response = await prisma.addTask(data.data.server_id, data.data.chat_id, data.data.name, data.data.interval, data.data.messenger);
    await publish<QueueEvent.PRISMA_ADD_TASK_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})
await consume (QueueEvent.PRISMA_GET_TASKS, async(data) => {
    const response = await prisma.getAllTasks();
    await publish<QueueEvent.PRISMA_GET_TASKS_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})
await consume (QueueEvent.PRISMA_GET_TASKS_BY_SERVER, async(data) => {
    const response = await prisma.getAllTasksByServer(data.data);
    await publish<QueueEvent.PRISMA_GET_TASKS_BY_SERVER_RESPONSE>(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    });
})
await consume (QueueEvent.PRISMA_DELETE_TASK, async(data) => {
    const response = await prisma.deleteTask(data.data);
})

console.log("DB-service is running")