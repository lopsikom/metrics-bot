import { PrismaClient, users, servers } from "./generated/prisma";

export const prisma = new PrismaClient();

export async function createNewUser(id: string, first_name: string, second_name?: string | null, login?: string | null): Promise<users> {
    const response = await prisma.users.create({
        data: {
            telegram_id: id,
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

export async function addTask(server_id: string, chat_id: string, task_name: string, interval: string) {
    const response = await prisma.task.create({
        data: {
            name: task_name,
            interval: interval,
            server_id: server_id,
            chat_id: chat_id
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