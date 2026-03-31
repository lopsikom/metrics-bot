import { addPendingRequest, publish, QueueEvent } from "@bot/shared";

export async function getServerMetrics(serverIp : string){
    const response = await addPendingRequest(QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS, serverIp);
    return response.data;
}
export async function sendMessageTelegram(id : string, message : string){
    await publish(QueueEvent.TELEGRAM_SEND_MESSAGE, {replyTo: id , data : {id, message}})
}
export async function sendMessageMax(id : string, message : string){
    await publish(QueueEvent.MAX_SEND_MESSAGE, {replyTo: id , data : {id, message}})
}
export async function sendMessage(id : string, message : string, messenger : string){
    if(messenger === "max") await sendMessageMax(id, message)
    else await sendMessageTelegram(id, message)
}
export async function AddTask(server_id : string, chat_id : string, name : string, interval : string, messenger : string = "telegram"){
    const response = await addPendingRequest(QueueEvent.PRISMA_ADD_TASK, {server_id, chat_id, name, interval, messenger})
    return response.data
}
export async function DeleteTask(task_id : string){
    await publish(QueueEvent.PRISMA_DELETE_TASK, {replyTo : task_id, data : task_id})
}
export async function allTask(){
    const response = await addPendingRequest(QueueEvent.PRISMA_GET_TASKS, undefined)
    return response.data
}