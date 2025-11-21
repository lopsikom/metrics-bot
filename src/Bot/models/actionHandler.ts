import WizardUserContext from "./userContext";

interface actionHandler {
    trigger : string | RegExp,
    handler : (ctx : WizardUserContext) => void
}

export default actionHandler