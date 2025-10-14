import { Context } from "telegraf";
import ReplyKeyboardEvents from "./replyEnum";

interface KeyboardHandler {
    title : string;
    handler : (ctx : Context) => void;
}

export default KeyboardHandler