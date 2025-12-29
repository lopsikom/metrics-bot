import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import ReplyKeyboardEvents from "@botModels/keyboards/replyEnum";
import ScenesEnum from "@botModels/Scenes/scenesEnum";
import prisma from "@prisma/prismaClient";
import handlersCollector from "Bot/services/handlersCollector";
import { Markup } from "telegraf";

handlersCollector.addHandlers({
    type : 'inlineKeyboard',
    trigger : inlineKeyboardEvent.ADD_SERVER,
    handler : (ctx) => {
        ctx.scene.enter(ScenesEnum.ADD_SERVER)
    }
},
{
    type : 'inlineKeyboard',
    trigger : inlineKeyboardEvent.HOW_TO_START,
    handler : (ctx) => {
        ctx.reply("Для начала требуется\nУказать адрес серве\nОпрашиваемый эндпоинт с метриками")
    }
},
{
    type : 'inlineKeyboard',
    trigger : inlineKeyboardEvent.START,
    handler : (ctx) =>{
        if(ctx.from){
            prisma.createNewUser(ctx.from.id.toString(), ctx.from.first_name, ctx.from.last_name ?? '', ctx.from.username ?? '')
        }
        ctx.reply('Начало', Markup.keyboard([[ReplyKeyboardEvents.SERVERS, ReplyKeyboardEvents.ACCOUNT], 
            [ReplyKeyboardEvents.ABOUT, ReplyKeyboardEvents.HELP]]).resize())
    }
})