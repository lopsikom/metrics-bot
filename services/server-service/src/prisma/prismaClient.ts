import { PrismaClient, users, servers } from "./generated/prisma";

export const prisma = new PrismaClient();

export async function createNewUser(telegram_id: string | null | undefined, first_name: string, second_name?: string | null, login?: string | null, max_id?: string | null): Promise<users> {
    const response = await prisma.users.create({
        data: {
            telegram_id: telegram_id || null,
            max_id: max_id || null,
            first_name: first_name,
            second_name: second_name,
            login: login
        }
    })
    return response
}

export async function getUserByTgId(id: string): Promise<users | null> {
    const response = await prisma.users.findFirst({
        where: { telegram_id: id }
    })
    return response
}

export async function getUserByMaxId(id: string): Promise<users | null> {
    const response = await prisma.users.findFirst({
        where: { max_id: id }
    })
    return response
}

export async function getUserById(id: string): Promise<users | null> {
    const response = await prisma.users.findFirst({
        where: { id: id }
    })
    return response
}

export async function getServersCountUser(id: string): Promise<number> {
    const response = await prisma.servers.count({
        where: { user_id: id }
    })
    return response
}

export async function getUserServers(id: string): Promise<servers[]> {
    const response = await prisma.servers.findMany({
        where: { user_id: id }
    })
    return response
}

export async function getServer(id: string): Promise<servers | null> {
    const response = await prisma.servers.findFirst({
        where: { id: id }
    })
    return response
}

export async function addServer(user_id: string, name: string, server_ip: string) : Promise<servers> {
    const response = await prisma.servers.create({
        data: {
            user_id: user_id,
            name: name,
            host: server_ip
        }
    })
    return response
}

export async function changeDataServer(id: string, data: { name?: string, host?: string }) {
    await prisma.servers.update({
        where: { id: id },
        data: data
    })
}

export async function deleteServer(id: string) {
    await prisma.servers.deleteMany({
        where: { id: id }
    })
}

export async function addTask(server_id: string, chat_id: string, task_name: string, interval: string, messenger: string = "telegram") {
    const response = await prisma.task.create({
        data: {
            name: task_name,
            interval: interval,
            server_id: server_id,
            chat_id: chat_id,
            messenger: messenger
        }
    })
    return response
}

export async function getAllTasks() {
    const response = await prisma.task.findMany({
        include: {
            servers: {
                select: { host: true }
            }
        }
    })
    return response
}

export async function getAllTasksByServer(server_id: string) {
    const response = await prisma.task.findMany({
        where: { server_id: server_id }
    })
    return response
}

export async function deleteTask(task_id: string) {
    const response = await prisma.task.delete({
        where: { id: task_id }
    })
    return response
}

export async function linkAccount(
    sourceMessenger: "telegram" | "max",
    sourceId: string,
    targetMessenger: "telegram" | "max",
    targetId: string
): Promise<{ success: boolean, error?: string, user?: users }> {

    const targetField = targetMessenger === "telegram" ? "telegram_id" : "max_id"
    const sourceField = sourceMessenger === "telegram" ? "telegram_id" : "max_id"

    const targetUser = await prisma.users.findFirst({
        where: { [targetField]: targetId }
    })

    if (!targetUser) {
        const sourceUser = await prisma.users.findFirst({
            where: { [sourceField]: sourceId }
        })
        if (!sourceUser) return { success: false, error: "Пользователь не найден" }
        if (sourceUser[targetField]) return { success: false, error: "Аккаунт уже привязан" }

        const updated = await prisma.users.update({
            where: { id: sourceUser.id },
            data: { [targetField]: targetId }
        })
        return { success: true, user: updated }
    }

    if (targetUser[sourceField]) {
        return { success: false, error: "Этот аккаунт уже привязан к другому пользователю" }
    }

    const sourceUser = await prisma.users.findFirst({
        where: { [sourceField]: sourceId }
    })

    if (sourceUser && sourceUser.id !== targetUser.id) {
        await prisma.servers.updateMany({
            where: { user_id: sourceUser.id },
            data: { user_id: targetUser.id }
        })
        await prisma.users.delete({ where: { id: sourceUser.id } })
    }

    const updated = await prisma.users.update({
        where: { id: targetUser.id },
        data: { [sourceField]: sourceId }
    })

    return { success: true, user: updated }
}