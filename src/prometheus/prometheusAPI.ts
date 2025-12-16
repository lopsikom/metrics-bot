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
    private async promQuery(...args : string[]){
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
        const diskQuery = `1 - node_filesystem_avail_bytes{instance="${instance}",mountpoint="/"} / node_filesystem_size_bytes{instance="${instance}",mountpoint="/"} `;
        const receiveNetwork = `sum by ("${instance}") (
        rate(node_network_receive_bytes_total{device!="lo"}[1m]))`
        const transmitNetwork = `sum by ("${instance}")(
        rate(node_network_transmit_bytes_total{device!="lo"}[1m]))`
        const forksQuery = `node_forks_total{instance="${instance}"}`

        const [cpu, ram, disk, receive, transmit, fork] = await this.promQuery(cpuQuery, ramQuery, diskQuery, receiveNetwork, transmitNetwork, forksQuery)

        return {
            cpu: Number(cpu?.[0]?.value[1] ?? 0),
            ram: Number(ram?.[0]?.value[1] ?? 0),
            disk: Number(disk?.[0]?.value[1] ?? 0),
            receiveNetwork : Number(receive[0].value[1] * 8 / 1024 / 1024),
            transmitNetwork : Number(transmit[0].value[1] * 8 / 1024 / 1024),
            fork : Number(fork[0].value[1])
        }
    }
    async checkUpServer(instance : string) : Promise<boolean>{
        const query = `up{instance="${instance}"}`
        const data = await this.promQuery(query)
        const value = Number(data?.[0][0].value[1] ?? 0)
        return value === 1

    }
    async getServerInfo(instance : string) {
        const os = `node_os_info{instance='${instance}'}`
        const info = `node_uname_info{instance='${instance}'}`
        const [osData, infoData] = await this.promQuery(os, info)
        console.log(osData)
        console.log(infoData)
        return {
            os : `${infoData[0].metric.sysname}, ${osData[0].metric.pretty_name}`,
            nodename : `${infoData[0].metric.nodename}`,
            machine : `${infoData[0].metric.machine}`
        }
    }
}

export default new PrometheusAPI()
