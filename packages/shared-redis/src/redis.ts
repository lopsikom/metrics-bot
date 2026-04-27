import dotenv from "dotenv"
import Redis from "ioredis"
import { RedisKeys } from "./models"

dotenv.config()


let redisClient : Redis | null = null

export async function getRedisClient(){
    if(redisClient) return redisClient
    const redisUrl = process.env.REDIS_URL;
    const redisPort = process.env.REDIS_PORT;
    redisClient = new Redis({
        port : Number(redisPort),
        host : redisUrl
    })
    return redisClient
}

export async function setRedisData<K extends keyof RedisKeys>(field : K, id : string, data : RedisKeys[K],){
    const client = await getRedisClient();
    client.set(`${field}:${id}`, JSON.stringify(data))
}

export async function getRedisData<K extends keyof RedisKeys>(field : K, id :string){
    const client = await getRedisClient();
    const response = await client.get(`${field}:${id}`)
    if(!response) return null
    return JSON.parse(response) as RedisKeys[K]
}

