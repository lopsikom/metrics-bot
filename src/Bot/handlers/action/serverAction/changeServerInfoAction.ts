import actionHandler from "@botModels/actionHandler";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";

const changeServerInfo : actionHandler = {
    trigger : /SERVER_CHANGE_INFO_*/,
    handler : (ctx) => {
        const server_id = getDataFromRegEx(ctx)
        console.log(server_id)
        ctx.reply("Выберите что хотите изменить",
            Markup.inlineKeyboard([[Markup.button.callback("Название", `SERVER_CHANGE_NAME_${server_id}`)],
        [Markup.button.callback("Адрес",`SERVER_CHANGE_HOST_${server_id}`)],[Markup.button.callback("Назад",`SELECT_SERVER_${server_id}`)]])
        )
        ctx.answerCbQuery()
    }
}

export default changeServerInfo