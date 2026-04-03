import { addPendingRequest, publish, QueueEvent } from "@bot/shared";

export async function getServersPrisma(id: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_USER_SERVER, id);
    return response.data;
}
export async function getServerPrisma(id: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_SERVER, id);
    return response.data;
}
export async function checkUpServerPrometheus(host: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER, host);
    return response.data;
}
export async function getServerInfoPrometheus(host: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_API_GET_SERVER_INFO, host);
    return response.data;
}
export async function addServerPrisma(id: string, name: string, server_ip: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_ADD_SERVER, { user_id: id, name: name, host: server_ip })
    return response.data
}
export async function addTargetConfig(host: string, first_name: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET, { server_ip: host, name: first_name });
    return response.data;
}
export async function changeDataServer(id: string, data: { name?: string, host?: string }) {
    const response = await addPendingRequest(QueueEvent.PRISMA_CHANGE_SERVER, { id: id, data });
    return response.data;
}
export async function changeTargetConfig(first_name: string, host: string, newHost: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET, { name: first_name, oldServer_ip: host, newServer_ip: newHost });
    return response.data;
}
export async function getUserById(Id: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_USER_BY_ID, Id);
    return response.data;
}
export async function getUserByMaxId(maxId: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_USER_BY_MAX_ID, maxId);
    return response.data;
}
export async function createNewUser(maxId: string, first_name: string, last_name?: string, username?: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_CREATE_NEW_USER, { max_id: maxId, first_name: first_name, second_name: last_name, login: username });
    return response.data;
}
export async function getServerCountUser(id: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_SERVERS_COUNT, id);
    return response.data;
}
export async function getAllTasksByServer(serverId: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_TASKS_BY_SERVER, serverId);
    return response.data;
}
export async function checkConfig(id: string, first_name: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_CONFIG_CHECK, { id: id, first_name: first_name });
    return response.data;
}
export async function getServerMetrics(serverIp: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS, serverIp);
    return response.data;
}
export async function deleteServer(serverId: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_DELETE_SERVER, serverId);
    return response.data;
}
export async function removeTargeConfig(host: string, first_name: string) {
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET, { server_ip: host, name: first_name })
    return response.data;
}
export async function emitTask(host: string, server_id: string, first_name: string, interval: string, chat_id: string, name: string, telegramChatId?: string) {
    await publish(QueueEvent.CRON_EMIT_TASK, { replyTo: server_id, data: { host, server_id, first_name, interval, chat_id, name, messenger: "max" } })
    if (telegramChatId) {
        await publish(QueueEvent.CRON_EMIT_TASK, { replyTo: server_id, data: { host, server_id, first_name, interval, chat_id: telegramChatId, name, messenger: "telegram" } })
    }
}
export async function unEmitTask(id: string) {
    const response = await addPendingRequest(QueueEvent.CRON_UN_EMIT_TASK, id);
    return response.data;
}
export async function linkAccount(sourceId: string, targetId: string) {
    const response = await addPendingRequest(QueueEvent.PRISMA_LINK_ACCOUNT, {
        source_messenger: "max" as const,
        source_id: sourceId,
        target_messenger: "telegram" as const,
        target_id: targetId
    });
    return response.data;
}
