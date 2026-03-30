import { QueueEventConsumerMap, QueueEventMap } from "../events";
import { getRabbitChannel } from "./connection";

export async function consume<K extends keyof QueueEventMap>(
    queue : K | string, 
    handler : (data : QueueEventMap[K]) => Promise<void>, 
    options? : {durable? : boolean, autoDelete? : boolean, expires? : number, exclusive? : boolean, listenOnce? : boolean, arguments? : any}) {
    const channel = await getRabbitChannel();
    console.log("consume ", queue)
    await channel.assertQueue(queue, {durable : options?.durable ?? true, autoDelete : options?.autoDelete ?? false, expires : options?.expires, exclusive : options?.exclusive, arguments : options?.arguments});
    const {consumerTag} = await channel.consume(queue, async (msg) => {
        if(!msg) return
        try{
            console.log(msg.content.toString())
            const data = JSON.parse(msg.content.toString()) as QueueEventMap[K]
            await handler(data)
            channel.ack(msg);
            if(options?.listenOnce) {
                await channel.cancel(consumerTag)
            }
        }catch(e){
            console.error("Consume error", e)
            channel.nack(msg, false, false)
        }
    })
}