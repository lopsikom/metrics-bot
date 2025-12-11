import fs from 'fs/promises'
import YAML from "yaml"
import dotenv from "dotenv"
import { targetsPrometheus } from '@prometheus/models/targetsPrometheus'
import path from 'path'

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
    async writeConfig(newConfig : targetsPrometheus[], name : string) {
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

}

export default new PrometheusConfig()