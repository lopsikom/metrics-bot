import { randomUUID } from "crypto";
import {IRabbitEvent, QueueEvent, QueueEventConsumerMap, QueueEventMap, QueueEventRequestToResponse, QueueEventResponseMap, ResponseKey} from "../events/index"
import {publish} from "./publisher"
import {consume} from "./consumer"
 
export async function addPendingRequest<K extends keyof QueueEventConsumerMap>(
    replyTo : K,
    data : QueueEventConsumerMap[K] extends IRabbitEvent<infer T> ? T : void)
    : Promise<QueueEventResponseMap[QueueEventRequestToResponse[K]]> {
    const correlationID = randomUUID();
    console.log("addPending ", correlationID)
    return new Promise(async (resolve) => {
        await consume<QueueEventRequestToResponse[K]>(correlationID, async (data) => {
            console.log(data)
            resolve(data)
        }, {
            listenOnce : true,
            autoDelete : true,
            expires : 3600
        })
        publish(replyTo, { replyTo: correlationID, data: data } as unknown as QueueEventMap[K])
    })
}

