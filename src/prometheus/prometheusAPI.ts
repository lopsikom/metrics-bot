import axios from "axios"

class PrometheusAPI {
    private PROMETHEUS_URL : string
    private axiosClient
    constructor(){
        this.PROMETHEUS_URL = process.env.PROMETHEUS_URL ?? ""
        this.axiosClient = axios.create({baseURL : `${this.PROMETHEUS_URL}/api/v1`, headers : {
            'Content-Type': 'application/json'
        }})
    }
    async promQuery(...args : string[]){
        const data = await Promise.all(args.map(async i =>{
            const response = await this.axiosClient.get(`/query`, {
                params : {
                    query : i
                }
            })
            return response.data.data.result
        }))
        return data
    }
    async getServerMetrics(instance : string){
        const cpuQuery = `1 - avg(rate(node_cpu_seconds_total{mode="idle",instance="${instance}"}[1m]))`;
        const ramQuery = `1 - (node_memory_MemAvailable_bytes{instance="${instance}"} / node_memory_MemTotal_bytes{instance="${instance}"})`;
        const diskQuery = `node_filesystem_avail_bytes{instance="${instance}",mountpoint="/"} / node_filesystem_size_bytes{instance="${instance}",mountpoint="/"} `;

        const [cpu, ram, disk] = await this.promQuery(cpuQuery, ramQuery, diskQuery)

        return {
            cpu: Number(cpu?.[0]?.value[1] ?? 0),
            ram: Number(ram?.[0]?.value[1] ?? 0),
            disk: Number(disk?.[0]?.value[1] ?? 0)
        }
    }
}

export default new PrometheusAPI()
