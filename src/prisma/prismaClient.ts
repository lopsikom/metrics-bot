import { PrismaClient, Users } from "./generated/prisma";

class prismaClient {
    private prisma : PrismaClient
    constructor(){
        this.prisma = new PrismaClient();
    }
    async createNewUser(id : string, first_name : string, second_name? : string, login? : string) : Promise<Users | undefined>{
        const response = this.prisma.users.create({
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
}

const prisma = new prismaClient()

export default prisma