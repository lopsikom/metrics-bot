import userContext from "../userContext";

interface wizardHandler{
    title : string,
    handlers : ((ctx : userContext) => void)[]
}

export default wizardHandler