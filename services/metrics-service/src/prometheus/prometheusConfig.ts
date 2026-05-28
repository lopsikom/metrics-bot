import fs from 'fs/promises'
import YAML from "yaml"
import dotenv from "dotenv"
import { targetsPrometheus } from './models/targetsPrometheus'
import path from 'path'
import { getServersPrisma } from './utils'

dotenv.config()

class PrometheusConfig {
    private BASE_PATH : string
    private TARGETS_PATH : string
    constructor(){
        this.BASE_PATH = process.env.PATH_CONFIG ?? ""
        this.TARGETS_PATH = this.BASE_PATH + "/targets"
    }

    private async readConfig(name : string) : Promise<targetsPrometheus[]> {
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
    async checkConfig(first_name : string, id : string) : Promise<boolean>{
        try{ 
            const config = await fs.readFile(path.join(this.TARGETS_PATH, `${first_name}.yml`), 'utf8')
            const data = YAML.parse(config) as targetsPrometheus[]
            let added = false
            if(data[0].targets.length > 0) {                
                const servers = await getServersPrisma(id)
                if(!servers.data || servers.data.length < 0) return false
                for(const s of servers.data){
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
                    await this.writeConfig(data, first_name)
                    return new Promise((resolve) => {
                    setTimeout(() => resolve(true), 12000)
                })
                }
                else return true
            }
            else{
                const servers = await getServersPrisma(id)
                if(!servers.data || servers.data.length < 0) return false
                data[0].targets = servers.data.map(s => s.host)
                await this.writeConfig(data, first_name)
                return new Promise((resolve) => {
                    setTimeout(() => resolve(true), 12000)
                })
            }
        }catch(e){
            try{
            console.log(e)
            const data : targetsPrometheus[] = [{
                targets : [],
                labels : {group : first_name ?? ""}
            }]
            await fs.writeFile(path.join(this.TARGETS_PATH, `${first_name}.yml`), YAML.stringify(data), {encoding : 'utf8', mode : 0o644})
            const servers = await getServersPrisma(id)
            if(!servers .data|| servers.data.length < 0) return false
            data[0].targets = servers.data.map(s => s.host)
            await this.writeConfig(data, first_name)
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