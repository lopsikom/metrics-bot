import amqp, {Connection, Channel, ChannelModel} from "amqplib"
import dotenv from "dotenv"

dotenv.config();

let connection : ChannelModel | null = null;
let channel : Channel | null = null;

export async function getRabbitChannel() : Promise<Channel>{
    if(channel) return channel

    connection = (await amqp.connect(process.env.RABBITMQ_URL ??  "amqp:localhost"));
    channel = await connection.createChannel()

    connection.on('close', () => {
        console.warn('RabbitMQ connection close')
        connection = null
        channel = null
    })

  connection.on('error', (err) => {
    console.error('RabbitMQ error', err)
    connection = null
    channel = null
  })

  channel.on('close', () => {
    channel = null
  })

  channel.on('error', (err) => {
    console.error('RabbitMQ channel error', err)
    channel = null
  })
    
    return channel
}