import croneTime from "@botModels/crone/croneTime"
import WizardUserContext, { userContext } from "@botModels/userContext"
import { Servers } from "@prisma/generated/prisma"
import prisma from "@prisma/prismaClient"
import prometheusAPI from "@prometheus/prometheusAPI"
import cron, { ScheduledTask } from "node-cron"
import { Telegraf } from "telegraf"

class CroneTask {
    private emitTaskList : ScheduledTask[] = []
    async emitTask(ctx : userContext, server : Servers, interval : string){
        const options = {
            name : `DefaultTask_${ctx.user?.first_name}_${interval}_${new Date().getMilliseconds()}`,
            noOverlap : true
        }
       const task = cron.createTask(interval, async () => {
          try{
            const metrics = await prometheusAPI.getServerMetrics(server.host)
            await ctx.telegram.sendMessage(ctx.chat!.id,`Напоминание: ${croneTime[interval]}\n📊 Метрики сервера ${server.host}:\n\n` +
                `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%`)
          }
          catch(e){
            console.error(e)
          }
       }, options)
       console.log(task.name)
       prisma.addTask(server.id, ctx.chat?.id.toString() ?? "123", task.name ?? "", interval)
       task.start()
       this.emitTaskList.push(task)
    }
    unEmitTask(){

    }
    async initializeEmitTask(bot : Telegraf<WizardUserContext>) {
        const tasks = await prisma.getAllTasks()
        tasks.forEach(t => {
            const options = {
                name : t.name,
                noOverlap : true
            }
            console.log(`Регистрация ${t.name}`)
            const task = cron.createTask(t.interval, async () => {
                try{
                    const metrics = await prometheusAPI.getServerMetrics(t.Server.host)
                    await bot.telegram.sendMessage(t.chat_id,`Напоминание: ${croneTime[t.interval]}\n📊 Метрики сервера ${t.Server.host}:\n\n` +
                        `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                        `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                        `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%`)
                }
                catch(e){
                    console.error(e)
                }
            }, options)
            task.start()
            this.emitTaskList.push(task)
        })
    }
}

export default new CroneTask()