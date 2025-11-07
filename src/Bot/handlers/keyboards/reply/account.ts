import ReplyKeyboardEvents from "@botModels/keyboards/replyEnum";
import ReplyKeyboardHandler from "@botModels/keyboards/keyboardHandler";
import prisma from "@prisma/prismaClient";
import userContext from "@botModels/userContext";

const accountHandler : ReplyKeyboardHandler = {
    title : ReplyKeyboardEvents.ACCOUNT,
    handler : async (ctx : userContext) =>{
        const name = ctx.from?.first_name
        const id = ctx.from?.id
        const serversCount = await prisma.getServersCountUser(ctx.user?.id ?? '')
        const premium = ctx.from?.is_premium ? "Премиум аккаунт" : "Обычный аккаунт"
        ctx.reply(`Имя: ${name}\n
        ID: ${id}\n
        Тип аккаунта: ${premium}\n
        Количество серверов ${serversCount}`)
        }
    }
export default accountHandler