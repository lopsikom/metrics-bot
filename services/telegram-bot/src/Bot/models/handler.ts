import WizardUserContext from "./userContext";

type handlerType = "action" | "scene" | "inlineKeyboard" | "replyKeyboard"

export interface IHandler {
    type : handlerType,
    trigger : string | RegExp,
    handler : (ctx : WizardUserContext) => void
}
export default IHandler

export interface actionHandler extends IHandler {
    type : "action"
}
export interface wizardHandler extends IHandler {
    type : "scene"
}
export interface inlineKeyboardHandler extends IHandler {
    type : "inlineKeyboard"
}
export interface replyKeyboardHandler extends IHandler {
    type : "replyKeyboard"
}

