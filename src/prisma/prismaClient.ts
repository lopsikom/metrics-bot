import { PrismaClient, Users, Servers } from "./generated/prisma";


class prismaClient {
    private prisma : PrismaClient
    constructor(){
        this.prisma = new PrismaClient();
    }
    async createNewUser(id : string, first_name : string, second_name? : string, login? : string) : Promise<Users | undefined>{
        const response = await this.prisma.users.create({
            data : {
                telegram_id : id,
                first_name : first_name,
                second_name : second_name,
                login : login
            }
        })
        return response
    }
    async getUserByTgId(id : string) : Promise<Users | null>{
        const response = await this.prisma.users.findFirst({
            where : {telegram_id : id}
        })
        return response
    }
    async getUserById(id : string) : Promise<Users | null>{
        const response = await this.prisma.users.findFirst({
            where : {id : id}
        })
        return response
    }
    async getServersCountUser(id : string) : Promise<number>{
        const response = await this.prisma.servers.count({
            where : {
                user_id : id
            }
        })
        return response
    }
    async getUserServers(id : string) : Promise<Servers[]> {
        const response = await this.prisma.servers.findMany({
            where : {
                user_id : id
            }
        })
        return response
    }
    async getServer(id : string) : Promise<Servers | null>{
        const response = await this.prisma.servers.findFirst({
            where : {
                id : id
            }
        })
        return response
    }
    async addServer(user_id : string, name : string, server_ip : string, endpoint? : string) {
        await this.prisma.servers.create({
            data : {
                user_id : user_id,
                name : name,
                host : server_ip,
                endpoint : endpoint
            }
        })
    }
    async deleteServer(id : string) {
        await this.prisma.servers.deleteMany({
            where : {
                id : id
            }
        })
    }
}

const prisma = new prismaClient()

export default prisma