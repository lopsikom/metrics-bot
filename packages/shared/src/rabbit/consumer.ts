import { QueueEventMap } from "../events";
import { getRabbitChannel, registerSubscription, unregisterSubscription } from "./connection";

export async function consume<K extends keyof QueueEventMap>(
    queue : K | string,
    handler : (data : QueueEventMap[K]) => Promise<void>,
    options? : {durable? : boolean, autoDelete? : boolean, expires? : number, exclusive? : boolean, listenOnce? : boolean, arguments? : any}) {

    // Функция, которая полностью оформляет подписку на актуальном канале.
    // Используется и при первичной регистрации, и при re-subscribe после reconnect.
    const subscribe = async () => {
        const channel = await getRabbitChannel();
        console.log("[rabbit] consume", queue);
        await channel.assertQueue(queue, {
            durable : options?.durable ?? true,
            autoDelete : options?.autoDelete ?? false,
            expires : options?.expires,
            exclusive : options?.exclusive,
            arguments : options?.arguments
        });
        const {consumerTag} = await channel.consume(queue, async (msg) => {
            if (!msg) return;
            try {
                const data = JSON.parse(msg.content.toString()) as QueueEventMap[K];
                await handler(data);
                channel.ack(msg);
                if (options?.listenOnce) {
                    // Одноразовая подписка отработала — снимаем себя из реестра,
                    // чтобы после reconnect не воскреснуть на уже удалённой очереди.
                    unregisterSubscription(subscribe);
                    await channel.cancel(consumerTag);
                }
            } catch (e) {
                console.error(`[rabbit] consume error on queue "${String(queue)}"`, e);
                channel.nack(msg, false, false);
            }
        });
    };

    registerSubscription(subscribe);
    await subscribe();
}
