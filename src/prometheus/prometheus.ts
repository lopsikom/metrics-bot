import fs from 'fs/promises'
import YAML from "yaml"
import dotenv from "dotenv"
import { configPrometheus } from '@prometheus/models/configPrometheus'

dotenv.config()

class Prometheus {
    private PATH : string
    constructor(){
        this.PATH = process.env.PATH_CONFIG ?? ""
    }

    async readConfig() : Promise<configPrometheus[]> {
        const config = await fs.readFile(this.PATH, 'utf8')
        const data = YAML.parse(config) as configPrometheus[]
        return data
    }
    async writeConfig(newConfig : configPrometheus[]) {
        const data = YAML.stringify(newConfig)
        await fs.writeFile(this.PATH, data, {encoding : 'utf8', mode : 0o644})
    }
    async addTargetConfig(server_ip : string) {
        const config = await this.readConfig()
        config[0].targets.push(server_ip)
        await this.writeConfig(config)
    }
    async removeTargeConfig(server_ip : string){
        const config = await this.readConfig()
        const index = config[0].targets.indexOf(server_ip)
        if(index !== -1){
            config[0].targets.splice(index, 1)
        }
        await this.writeConfig(config)
    }

}

export default new Prometheus()