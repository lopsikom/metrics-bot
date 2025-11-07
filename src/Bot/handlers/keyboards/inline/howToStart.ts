import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import KeyboardHandler from "@botModels/keyboards/keyboardHandler";

const howToStartAction : KeyboardHandler = {
    title : inlineKeyboardEvent.HOW_TO_START,
    handler : (ctx) => {
        ctx.reply("Для начала требуется\nУказать адрес серве\nОпрашиваемый эндпоинт с метриками")
    }
}
export default howToStartAction