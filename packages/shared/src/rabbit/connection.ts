import amqp, {Channel, ChannelModel} from "amqplib"
import dotenv from "dotenv"

dotenv.config();

let connection : ChannelModel | null = null;
let channel : Channel | null = null;
let connecting : Promise<Channel> | null = null;
let reconnecting = false;

// Реестр постоянных подписок. Каждая запись — функция, которая
// заново вешает consume на свежий канал. Для listenOnce-подписок
// запись удаляется самим consumer'ом после ack/cancel.
type Subscription = () => Promise<void>;
const subscriptions: Set<Subscription> = new Set();

export function registerSubscription(sub: Subscription) {
    subscriptions.add(sub);
}

export function unregisterSubscription(sub: Subscription) {
    subscriptions.delete(sub);
}

async function openConnection(): Promise<Channel> {
    const url = process.env.RABBITMQ_URL ?? "amqp://localhost";
    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    connection.on('close', () => {
        console.warn('[rabbit] connection closed');
        connection = null;
        channel = null;
        scheduleReconnect();
    });

    connection.on('error', (err) => {
        console.error('[rabbit] connection error', err);
    });

    channel.on('close', () => {
        console.warn('[rabbit] channel closed');
        channel = null;
    });

    channel.on('error', (err) => {
        console.error('[rabbit] channel error', err);
        channel = null;
    });

    return channel;
}

export async function getRabbitChannel(): Promise<Channel> {
    if (channel) return channel;
    if (connecting) return connecting;

    connecting = (async () => {
        try {
            return await openConnection();
        } finally {
            connecting = null;
        }
    })();
    return connecting;
}

function scheduleReconnect() {
    if (reconnecting) return;
    reconnecting = true;
    void reconnectLoop();
}

async function reconnectLoop() {
    let attempt = 0;
    while (true) {
        const delay = Math.min(30_000, 1_000 * Math.pow(2, attempt));
        attempt++;
        console.log(`[rabbit] reconnect attempt #${attempt} in ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
        try {
            await getRabbitChannel();
            console.log(`[rabbit] reconnected on attempt #${attempt}, re-subscribing ${subscriptions.size} consumers`);
            // Снимаем все подписки в массив до цикла: в ходе resubscribe некоторые
            // могут сами себя удалить (listenOnce), и мутация Set'а во время
            // итерации создаст сюрпризы.
            const snapshot = Array.from(subscriptions);
            let restored = 0;
            for (const sub of snapshot) {
                try {
                    await sub();
                    restored++;
                } catch (e) {
                    console.error('[rabbit] failed to restore subscription', e);
                }
            }
            console.log(`[rabbit] re-subscribed ${restored}/${snapshot.length} consumers`);
            reconnecting = false;
            return;
        } catch (e) {
            console.error(`[rabbit] reconnect attempt #${attempt} failed`, e);
            // канал/коннект уже сброшены в openConnection при провале — продолжаем цикл
        }
    }
}
