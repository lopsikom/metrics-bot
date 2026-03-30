import { QueueEventConsumerMap, QueueEventMap, QueueEventResponseMap } from "../events";
import { getRabbitChannel } from "./connection";

export async function publish<K extends keyof QueueEventMap>(
    queue: K | string, 
    data : QueueEventMap[K],
    options? : {durable? : boolean, autoDelete? : boolean, expires? : number, exclusive? : boolean, listenOnce? : boolean, arguments? : any}
) {
    const channel = await getRabbitChannel();
    await channel.assertQueue(queue, {durable : options?.durable ?? true, autoDelete : options?.autoDelete ?? false, expires : options?.expires, exclusive : options?.exclusive, arguments : options?.arguments})
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
}