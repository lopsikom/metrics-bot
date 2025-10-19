import { PrismaClient } from "./generated/prisma";

class prismaClient {
    private prisma : PrismaClient
    constructor(){
        this.prisma = new PrismaClient();
    }
    createNewUser(id : string, first_name : string, second_name : string, login : string){
        this.prisma.users.create({
            data : {
                telegram_id : id,
                first_name : first_name,
                second_name : second_name,
                login : login
            }
        })
        .then(() => this.prisma.$disconnect())
        .catch(e => console.error(e))
    }
}

const prisma = new prismaClient()

export default prisma