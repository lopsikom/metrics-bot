export interface IServerInfo{
    os : string,
    nodename : string,
    machine : string
}
export interface IServerMetrics{
    cpu : number,
    ram : number,
    disk : number,
    receiveNetwork : number,
    transmitNetwork : number,
    fork : number
}