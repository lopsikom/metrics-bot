import { IServerInfo, IServerMetrics } from "./prometheus/api";
import { IAddRemoveTarget, IChangeTarget, ICheckConfig } from "./prometheus/config";
import {ServerPrisma, ServerPrismaAdd, TaskPrisma, TaskPrismaAdd, TaskPrismaWithServer, UserPrisma, UserPrismaAdd, LinkAccountData, LinkAccountResult } from "./server/serverEvent";
import {IEmitTask} from "./crone/crone"

export interface IRabbitEvent<T>{
    data : T,
    replyTo : string
}
export enum QueueEvent {
    PRISMA_CREATE_NEW_USER = "prisma.createUser",
    PRISMA_CREATE_NEW_USER_RESPONSE = "prisma.createUser.response",
    PRISMA_GET_USER_BY_ID = "prisma.getUserById",
    PRISMA_GET_USER_BY_ID_RESPONSE = "prisma.getUserById.response",
    PRISMA_GET_USER_BY_TGID = "prisma.getUserByTgId",
    PRISMA_GET_USER_BY_TGID_RESPONSE = "prisma.getUserByTgId.response",
    PRISMA_GET_SERVERS_COUNT = "prisma.getServersCount",
    PRISMA_GET_SERVERS_COUNT_RESPONSE = "prisma.getServersCount.response",
    PRISMA_GET_USER_SERVER = "prisma.GetUserServer",
    PRISMA_GET_USER_SERVER_RESPONSE = "prisma.GetUserServer.response",
    PRISMA_GET_SERVER = "prisma.GetServer",
    PRISMA_GET_SERVER_RESPONSE = "prisma.GetServer.response",
    PRISMA_ADD_SERVER = "prisma.AddServer",
    PRISMA_ADD_SERVER_RESPONSE = "prisma.AddServer.response",
    PRISMA_CHANGE_SERVER = "prisma.ChangeServer",
    PRISMA_CHANGE_SERVER_RESPONSE = "prisma.ChangeServer.response",
    PRISMA_DELETE_SERVER = "prisma.DeleteServer",
    PRISMA_DELETE_SERVER_RESPONSE = "prisma.DeleteServer.response",
    PRISMA_ADD_TASK = "prisma.AddTask",
    PRISMA_ADD_TASK_RESPONSE = "prisma.AddTask.response",
    PRISMA_GET_TASKS = "prisma.GetAllTasks",
    PRISMA_GET_TASKS_RESPONSE = "prisma.GetAllTasks.response",
    PRISMA_GET_TASKS_BY_SERVER = "prisma.GetAllTasksByServer",
    PRISMA_GET_TASKS_BY_SERVER_RESPONSE = "prisma.GetAllTasksByServer.response",
    PRISMA_DELETE_TASK = "prisma.deleteTask",
    PRISMA_DELETE_TASK_RESPONSE = "prisma.deleteTask.response",

    PROMETHEUS_CONFIG_ADD_TARGET = "prometheus.configAddTarget",
    PROMETHEUS_CONFIG_ADD_TARGET_RESPONSE = "prometheus.configAddTarget.response",
    PROMETHEUS_CONFIG_CHANGE_TARGET = "prometheus.configChangeTarget",
    PROMETHEUS_CONFIG_CHANGE_TARGET_RESPONSE = "prometheus.configChangeTarget.response",
    PROMETHEUS_CONFIG_CHECK = "prometheus.configCheck",
    PROMETHEUS_CONFIG_CHECK_RESPONSE = "prometheus.configCheck.response",
    PROMETHEUS_CONFIG_REMOVE_TARGET = "prometheus.configRemoveTarget",
    PROMETHEUS_CONFIG_REMOVE_TARGET_RESPONSE = "prometheus.configRemoveTarget.response",
    PROMETHEUS_API_GET_SERVER_METRICS = "prometheus.APIGetServerMetrics",
    PROMETHEUS_API_GET_SERVER_METRICS_RESPONSE = "prometheus.APIGetServerMetrics.response",
    PROMETHEUS_API_CHECK_UP_SERVER = "prometheus.CheckUpServer",
    PROMETHEUS_API_CHECK_UP_SERVER_RESPONSE = "prometheus.CheckUpServer.response",
    PROMETHEUS_API_GET_SERVER_INFO = "prometheus.getServerInfo",
    PROMETHEUS_API_GET_SERVER_INFO_RESPONSE = "prometheus.getServerInfo.response",

    TELEGRAM_SEND_MESSAGE = "telegram.sendMessage",
    TELEGRAM_SEND_MESSAGE_RESPONSE = "telegram.sendMessage.response",

    MAX_SEND_MESSAGE = "max.sendMessage",
    MAX_SEND_MESSAGE_RESPONSE = "max.sendMessage.response",

    PRISMA_GET_USER_BY_MAX_ID = "prisma.getUserByMaxId",
    PRISMA_GET_USER_BY_MAX_ID_RESPONSE = "prisma.getUserByMaxId.response",

    PRISMA_LINK_ACCOUNT = "prisma.linkAccount",
    PRISMA_LINK_ACCOUNT_RESPONSE = "prisma.linkAccount.response",

    CRON_EMIT_TASK = "cron.emitTask",
    CRON_EMIT_TASK_RESPONSE = "cron.emitTask.response",
    CRON_UN_EMIT_TASK = "cron.UnEmitTask",
    CRON_UN_EMIT_TASK_RESPONSE = "cron.UnEmitTask.response"
}

export interface QueueEventConsumerMap {
    [QueueEvent.PRISMA_CREATE_NEW_USER]: IRabbitEvent<UserPrismaAdd>,
    [QueueEvent.PRISMA_GET_USER_BY_ID]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_GET_USER_BY_TGID]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_GET_SERVERS_COUNT]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_GET_USER_SERVER]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_GET_SERVER]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_ADD_SERVER]: IRabbitEvent<ServerPrismaAdd>,
    [QueueEvent.PRISMA_CHANGE_SERVER]: IRabbitEvent<{id: string, data: {name?: string, host?: string}}>,
    [QueueEvent.PRISMA_DELETE_SERVER]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_ADD_TASK]: IRabbitEvent<TaskPrismaAdd>,
    [QueueEvent.PRISMA_GET_TASKS]: IRabbitEvent<void>,
    [QueueEvent.PRISMA_GET_TASKS_BY_SERVER]: IRabbitEvent<string>,
    [QueueEvent.PRISMA_DELETE_TASK]: IRabbitEvent<string>,
    [QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET] : IRabbitEvent<IAddRemoveTarget>,
    [QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET] : IRabbitEvent<IChangeTarget>,
    [QueueEvent.PROMETHEUS_CONFIG_CHECK] : IRabbitEvent<ICheckConfig>,
    [QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET] : IRabbitEvent<IAddRemoveTarget>,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS] : IRabbitEvent<string>,
    [QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER] : IRabbitEvent<string>,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_INFO] : IRabbitEvent<string>,
    [QueueEvent.TELEGRAM_SEND_MESSAGE] : IRabbitEvent<{id : string, message : string}>,
    [QueueEvent.MAX_SEND_MESSAGE] : IRabbitEvent<{id : string, message : string}>,
    [QueueEvent.PRISMA_GET_USER_BY_MAX_ID] : IRabbitEvent<string>,
    [QueueEvent.PRISMA_LINK_ACCOUNT] : IRabbitEvent<LinkAccountData>,
    [QueueEvent.CRON_EMIT_TASK] : IRabbitEvent<IEmitTask>,
    [QueueEvent.CRON_UN_EMIT_TASK] : IRabbitEvent<string>
}

export interface QueueEventResponseMap {
    [QueueEvent.PRISMA_CREATE_NEW_USER_RESPONSE]: IRabbitEvent<UserPrisma>,
    [QueueEvent.PRISMA_GET_USER_BY_ID_RESPONSE]: IRabbitEvent<UserPrisma | null>,
    [QueueEvent.PRISMA_GET_USER_BY_TGID_RESPONSE]: IRabbitEvent<UserPrisma | null>,
    [QueueEvent.PRISMA_GET_SERVERS_COUNT_RESPONSE]: IRabbitEvent<number>,
    [QueueEvent.PRISMA_GET_USER_SERVER_RESPONSE]: IRabbitEvent<ServerPrisma[]>,
    [QueueEvent.PRISMA_GET_SERVER_RESPONSE]: IRabbitEvent<ServerPrisma | null>,
    [QueueEvent.PRISMA_ADD_SERVER_RESPONSE]: IRabbitEvent<ServerPrismaAdd>,
    [QueueEvent.PRISMA_CHANGE_SERVER_RESPONSE]: IRabbitEvent<void>,
    [QueueEvent.PRISMA_DELETE_SERVER_RESPONSE]: IRabbitEvent<void>,
    [QueueEvent.PRISMA_ADD_TASK_RESPONSE]: IRabbitEvent<TaskPrisma>,
    [QueueEvent.PRISMA_GET_TASKS_RESPONSE]: IRabbitEvent<TaskPrismaWithServer[]>,
    [QueueEvent.PRISMA_GET_TASKS_BY_SERVER_RESPONSE]: IRabbitEvent<TaskPrisma[]>,
    [QueueEvent.PRISMA_DELETE_TASK_RESPONSE]: IRabbitEvent<TaskPrisma>,
    [QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.PROMETHEUS_CONFIG_CHECK_RESPONSE] : IRabbitEvent<boolean>,
    [QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS_RESPONSE] : IRabbitEvent<IServerMetrics>,
    [QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER_RESPONSE] : IRabbitEvent<boolean>,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_INFO_RESPONSE] : IRabbitEvent<IServerInfo>,
    [QueueEvent.TELEGRAM_SEND_MESSAGE_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.MAX_SEND_MESSAGE_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.PRISMA_GET_USER_BY_MAX_ID_RESPONSE] : IRabbitEvent<UserPrisma | null>,
    [QueueEvent.PRISMA_LINK_ACCOUNT_RESPONSE] : IRabbitEvent<LinkAccountResult>,
    [QueueEvent.CRON_EMIT_TASK_RESPONSE] : IRabbitEvent<void>,
    [QueueEvent.CRON_UN_EMIT_TASK_RESPONSE] : IRabbitEvent<boolean>
}
export type QueueEventRequestToResponse = {
    [QueueEvent.PRISMA_CREATE_NEW_USER]:                QueueEvent.PRISMA_CREATE_NEW_USER_RESPONSE,
    [QueueEvent.PRISMA_GET_USER_BY_ID]:                 QueueEvent.PRISMA_GET_USER_BY_ID_RESPONSE,
    [QueueEvent.PRISMA_GET_USER_BY_TGID]:               QueueEvent.PRISMA_GET_USER_BY_TGID_RESPONSE,
    [QueueEvent.PRISMA_GET_SERVERS_COUNT]:              QueueEvent.PRISMA_GET_SERVERS_COUNT_RESPONSE,
    [QueueEvent.PRISMA_GET_USER_SERVER]:                QueueEvent.PRISMA_GET_USER_SERVER_RESPONSE,
    [QueueEvent.PRISMA_GET_SERVER]:                     QueueEvent.PRISMA_GET_SERVER_RESPONSE,
    [QueueEvent.PRISMA_ADD_SERVER]:                     QueueEvent.PRISMA_ADD_SERVER_RESPONSE,
    [QueueEvent.PRISMA_CHANGE_SERVER]:                  QueueEvent.PRISMA_CHANGE_SERVER_RESPONSE,
    [QueueEvent.PRISMA_DELETE_SERVER]:                  QueueEvent.PRISMA_DELETE_SERVER_RESPONSE,
    [QueueEvent.PRISMA_ADD_TASK]:                       QueueEvent.PRISMA_ADD_TASK_RESPONSE,
    [QueueEvent.PRISMA_GET_TASKS]:                      QueueEvent.PRISMA_GET_TASKS_RESPONSE,
    [QueueEvent.PRISMA_GET_TASKS_BY_SERVER]:            QueueEvent.PRISMA_GET_TASKS_BY_SERVER_RESPONSE,
    [QueueEvent.PRISMA_DELETE_TASK]:                    QueueEvent.PRISMA_DELETE_TASK_RESPONSE,
    [QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET]:          QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET_RESPONSE,
    [QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET]:       QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET_RESPONSE,
    [QueueEvent.PROMETHEUS_CONFIG_CHECK]:               QueueEvent.PROMETHEUS_CONFIG_CHECK_RESPONSE,
    [QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET]:       QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET_RESPONSE,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS]:     QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS_RESPONSE,
    [QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER]:        QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER_RESPONSE,
    [QueueEvent.PROMETHEUS_API_GET_SERVER_INFO]:        QueueEvent.PROMETHEUS_API_GET_SERVER_INFO_RESPONSE,
    [QueueEvent.TELEGRAM_SEND_MESSAGE] :                QueueEvent.TELEGRAM_SEND_MESSAGE_RESPONSE,
    [QueueEvent.MAX_SEND_MESSAGE] :                    QueueEvent.MAX_SEND_MESSAGE_RESPONSE,
    [QueueEvent.PRISMA_GET_USER_BY_MAX_ID] :           QueueEvent.PRISMA_GET_USER_BY_MAX_ID_RESPONSE,
    [QueueEvent.PRISMA_LINK_ACCOUNT] :                 QueueEvent.PRISMA_LINK_ACCOUNT_RESPONSE,
    [QueueEvent.CRON_EMIT_TASK] :                       QueueEvent.CRON_EMIT_TASK_RESPONSE,
    [QueueEvent.CRON_UN_EMIT_TASK] :                    QueueEvent.CRON_UN_EMIT_TASK_RESPONSE
}


export type QueueEventMap = QueueEventConsumerMap & QueueEventResponseMap; 
export type ResponseKey <K extends keyof QueueEventConsumerMap> = `${K}.response` extends keyof QueueEventResponseMap ? `${K & string}.response` : never;