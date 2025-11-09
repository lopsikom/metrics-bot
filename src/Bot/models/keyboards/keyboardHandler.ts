import WizardUserContext from "@botModels/userContext";


interface KeyboardHandler {
    title : string;
    handler : (ctx : WizardUserContext) => void;
}

export default KeyboardHandler