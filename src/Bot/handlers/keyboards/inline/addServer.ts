import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import KeyboardHandler from "@botModels/keyboards/keyboardHandler";
import ScenesEnum from "@botModels/Scenes/scenesEnum";

const addServer : KeyboardHandler = {
    title : inlineKeyboardEvent.ADD_SERVER,
    handler : (ctx) => {
        ctx.scene.enter(ScenesEnum.ADD_SERVER)
    }
}
export default addServer