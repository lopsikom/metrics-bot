import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum"
import ReplyKeyboardHandler from "@botModels/keyboards/keyboardHandler"
import ReplyKeyboardEvents from "@botModels/keyboards/replyEnum"
import WizardUserContext from "@botModels/userContext"
import { Markup } from "telegraf"

const helpHandler : ReplyKeyboardHandler = {
    title : ReplyKeyboardEvents.HELP,
    handler : (ctx : WizardUserContext) => {
        ctx.reply('Помощь и Поддержка:\nВыберите вопрос или проблему', Markup.inlineKeyboard([[Markup.button.callback('Как начать работу?', inlineKeyboardEvent.HOW_TO_START)]]))
    }
}
export default helpHandler
