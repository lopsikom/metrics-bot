import cron, { ScheduledTask } from "node-cron"
import { AddTask, allTask, DeleteTask, getServerMetrics, sendMessage, sendMessageTelegram } from "./utils"
import { croneTime } from "@bot/shared/src/events/crone/crone"

class CroneTask {
    private emitTaskList : Record<string, ScheduledTask> = {}
    async emitTask(host : string, server_id : string, first_name : string, chat_id : string, interval : string, name : string, messenger : string = "telegram"){
        const options = {
            name : `DefaultTask_${first_name}_${name}_${interval}_${new Date().getMilliseconds()}`,
            noOverlap : true
        }
       const task = cron.createTask(interval, async () => {
          try{
            const metrics = await getServerMetrics(host)
            sendMessage(chat_id,`Напоминание: ${croneTime[interval]}\n📊 Метрики сервера ${host}:\n\n` +
                `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%`, messenger)
          }
          catch(e){
            console.error(e)
          }
       }, options)
       try {
           const taskDB = await AddTask(server_id, chat_id.toString() ?? "123", task.name ?? "", interval, messenger)
           task.start()
           this.emitTaskList[taskDB.id] = task
       } catch (e) {
           task.stop()
           console.error("emitTask: AddTask failed, task stopped", e)
           throw e
       }
    }
    async unEmitTask(id : string) : Promise<boolean>{
        try{
            const task = this.emitTaskList[id]
            task.stop()
            delete this.emitTaskList[id]
            await DeleteTask(id)
            return true
        }catch(e){
            console.log(e)
            return false
        }
    }
    async initializeEmitTask() {
        const tasks = await allTask()
        tasks.forEach(t => {
            const options = {
                name : t.name,
                noOverlap : true
            }
            console.log(`Registry ${t.name}`)
            const task = cron.createTask(t.interval, async () => {
                try{
                    const metrics = await getServerMetrics(t.servers.host)
                    sendMessage(t.chat_id,`Напоминание: ${croneTime[t.interval]}\n📊 Метрики сервера ${t.servers.host}:\n\n` +
                        `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                        `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                        `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%`, t.messenger)
                }
                catch(e){
                    console.error(e)
                }
            }, options)
            task.start()
            this.emitTaskList[t.id] = task
        })
    }
}

export default new CroneTask()