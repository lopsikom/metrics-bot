export interface IAddRemoveTarget{
    server_ip : string,
    name : string
}
export interface IChangeTarget {
    name : string,
    oldServer_ip : string,
    newServer_ip : string
}
export interface ICheckConfig{
    first_name : string,
    id : string
}