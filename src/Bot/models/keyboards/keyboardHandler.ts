import { Context } from "telegraf";

interface KeyboardHandler {
    title : string;
    handler : (ctx : Context) => void;
}

export default KeyboardHandler