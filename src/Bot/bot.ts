import { Telegraf } from "telegraf";
import dotenv from "dotenv"
import {useAction, useActionInlineKeyboard, useHandlers, useHearsReplyKeyboard, useWizardScene} from "./handlers/handlerFactory";
import setStart from "./handlers/start";
import accountHandler from "./handlers/keyboards/reply/account";
import startAction from "./handlers/keyboards/inline/start";
import userMiddleware from "./middlewares/userMiddleware";
import WizardUserContext from "./models/userContext";
import helpHandler from "./handlers/keyboards/reply/help";
import howToStartAction from "./handlers/keyboards/inline/howToStart";
import serverHandler from "./handlers/keyboards/reply/servers";
import addServer from "./Scenes/addServer";
import addServerInline from "./handlers/keyboards/inline/addServer";
import serverAction from "./handlers/action/serverAction/serverAction";
import deleteServerAction from "./handlers/action/serverAction/deleteServerAction";
import metricServerAction from "./handlers/action/serverAction/metricServerAction";
import changeServerInfo from "./handlers/action/serverAction/changeServerInfoAction";
import changeNameServerScene from "./Scenes/changeServerInfoScenes/changeNameServerScene";
import changeNameServer from "./handlers/action/serverAction/changeServerInfoAction/changeNameServerAction";
import changeHostServer from "./handlers/action/serverAction/changeServerInfoAction/changeHostServerAction";
import changeHostServerScene from "./Scenes/changeServerInfoScenes/changeHostServerScene";
import serverTaskEmitScene from "./Scenes/serverTaskEmitScene";
import serverTaskEmitAction from "./handlers/action/serverAction/taskAction/serverTaskEmitAction";
import serverTasksInfo from "./handlers/action/serverAction/taskAction/serverTasksInfo";
import serverTaskDeleteAction from "./handlers/action/serverAction/taskAction/serverTaskDeleteAction";
import taskDeleteAction from "./handlers/action/serverAction/taskAction/taskDeleteAction";

dotenv.config()

const bot = new Telegraf<WizardUserContext>(process.env.BOT_TOKEN ?? "")
//Команды до подключения основого middleware
setStart(bot)
useActionInlineKeyboard(bot, startAction)
bot.use(userMiddleware)
useWizardScene(bot, addServer, changeNameServerScene, changeHostServerScene, serverTaskEmitScene)
useAction(bot, serverAction, deleteServerAction, metricServerAction, changeServerInfo, changeNameServer, changeHostServer, serverTaskEmitAction, serverTasksInfo, serverTaskDeleteAction, taskDeleteAction)
useHandlers(bot)
useHearsReplyKeyboard(bot, accountHandler, helpHandler, serverHandler)
useActionInlineKeyboard(bot, howToStartAction, addServerInline)

export default bot