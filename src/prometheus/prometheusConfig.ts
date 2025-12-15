import fs from 'fs/promises'
import YAML from "yaml"
import dotenv from "dotenv"
import { targetsPrometheus } from '@prometheus/models/targetsPrometheus'
import path from 'path'
import { userContext } from '@botModels/userContext'
import prisma from '@prisma/prismaClient'

dotenv.config()

class PrometheusConfig { //Придумать как передавать user_name (мб через редис)
    private BASE_PATH : string
    private TARGETS_PATH : string
    constructor(){
        this.BASE_PATH = process.env.PATH_CONFIG ?? ""
        this.TARGETS_PATH = this.BASE_PATH + "/targets"
    }

    async readConfig(name : string) : Promise<targetsPrometheus[]> {
        try{
            const config = await fs.readFile(path.join(this.TARGETS_PATH, `${name}.yml`), 'utf8')
            const data = YAML.parse(config) as targetsPrometheus[]
            return data
        }catch(e){
            console.log(e)
            const data : targetsPrometheus[] = [{
                targets : [],
                labels : {group : name}
            }]
            
            await fs.writeFile(path.join(this.TARGETS_PATH, `${name}.yml`), YAML.stringify(data), {encoding : 'utf8', mode : 0o644})
            return this.readConfig(name)
        }
    }
    private async writeConfig(newConfig : targetsPrometheus[], name : string) {
        const data = YAML.stringify(newConfig)
        await fs.writeFile(path.join(this.TARGETS_PATH, `${name}.yml`), data, {encoding : 'utf8', mode : 0o644})
    }
    async addTargetConfig(server_ip : string, name : string) {
        const config = await this.readConfig(name)
        config[0].targets.push(server_ip)
        await this.writeConfig(config, name)
    }
    async removeTargeConfig(server_ip : string, name : string){
        const config = await this.readConfig(name)
        const index = config[0].targets.indexOf(server_ip)
        if(index !== -1){
            config[0].targets.splice(index, 1)
        }
        await this.writeConfig(config, name)
    }
    async changeTargetConfig(name : string, oldServer_ip : string, newServer_ip : string) {
        const config = await this.readConfig(name)
        const index = config[0].targets.indexOf(oldServer_ip)
        if(index !== -1){
            config[0].targets[index] = newServer_ip
        }
        await this.writeConfig(config, name)
    }
    async checkConfig(user : userContext) : Promise<boolean>{
        if(!user.user) return false
        try{ 
            const config = await fs.readFile(path.join(this.TARGETS_PATH, `${user.user?.first_name}.yml`), 'utf8')
            const data = YAML.parse(config) as targetsPrometheus[]
            let added = false
            if(data[0].targets.length > 0) {
                const servers = await prisma.getServers(user.user.id)
                if(!servers || servers.length < 0) return false
                for(const s of servers){
                    let match = false
                   for(const t of data[0].targets){
                    if(s.host === t) {match = true; break}
                   }
                   if(!match) {
                    data[0].targets.push(s.host)
                    added = true
                   }
                }
                if(added){
                    await this.writeConfig(data, user.user.first_name)
                    return new Promise((resolve) => {
                    setTimeout(() => resolve(true), 12000)
                })
                }
                else return true
            }
            else{
                const servers = await prisma.getServers(user.user.id)
                if(!servers || servers.length < 0) return false
                data[0].targets = servers.map(s => s.host)
                await this.writeConfig(data, user.user.first_name)
                return new Promise((resolve) => {
                    setTimeout(() => resolve(true), 12000)
                })
            }
        }catch(e){
            try{
                console.log(e)
            const data : targetsPrometheus[] = [{
                targets : [],
                labels : {group : user.user?.first_name ?? ""}
            }]
            
            await fs.writeFile(path.join(this.TARGETS_PATH, `${user.user.first_name}.yml`), YAML.stringify(data), {encoding : 'utf8', mode : 0o644})
            const servers = await prisma.getServers(user.user.id)
            if(!servers || servers.length < 0) return false
            data[0].targets = servers.map(s => s.host)
            await this.writeConfig(data, user.user.first_name)
            return new Promise((resolve) => {
                setTimeout(() => resolve(true), 12000)
                })
            }catch(e) {
                console.log(e)
                return false
            }
        }
    }

}

export default new PrometheusConfig()