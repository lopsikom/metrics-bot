import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import KeyboardHandler from "@botModels/keyboards/keyboardHandler";

const addServer : KeyboardHandler = {
    title : inlineKeyboardEvent.ADD_SERVER,
    handler : (ctx) => {
        ctx.scene.enter("add_server")
    }
}
export default addServer