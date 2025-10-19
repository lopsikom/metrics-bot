import { Markup } from "telegraf";
import KeyboardHandler from "../../../models/keyboards/keyboardHandler";
import ReplyKeyboardEvents from "../../../models/keyboards/replyEnum";
import inlineKeyboardEvent from "../../../models/keyboards/inlineEnum";
import prisma from "../../../../prisma/prismaClient";

const startAction : KeyboardHandler = {
    title : inlineKeyboardEvent.START,
    handler : (ctx) =>{
        if(ctx.from){
            console.log("Reg")
            prisma.createNewUser(ctx.from.id.toString(), ctx.from.first_name, ctx.from.last_name ?? '', ctx.from.username ?? '')
        }
        ctx.reply('Начало', Markup.keyboard([[ReplyKeyboardEvents.SERVERS, ReplyKeyboardEvents.ACCOUNT], 
            [ReplyKeyboardEvents.ABOUT, ReplyKeyboardEvents.HELP]]).resize())
    }
}
export default startAction