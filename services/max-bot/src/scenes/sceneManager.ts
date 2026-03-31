export interface SceneState {
    scene: string
    step: number
    data: Record<string, any>
}

export type SceneStepHandler = (userId: number, text: string, state: SceneState) => Promise<void>

export interface SceneDefinition {
    name: string
    steps: SceneStepHandler[]
}

class SceneManager {
    private states = new Map<number, SceneState>()
    private scenes = new Map<string, SceneDefinition>()

    registerScene(scene: SceneDefinition) {
        this.scenes.set(scene.name, scene)
    }

    enter(userId: number, sceneName: string, initialData: Record<string, any> = {}) {
        this.states.set(userId, { scene: sceneName, step: 0, data: initialData })
        const scene = this.scenes.get(sceneName)
        if (scene && scene.steps[0]) {
            scene.steps[0](userId, "", this.states.get(userId)!)
        }
    }

    getState(userId: number): SceneState | undefined {
        return this.states.get(userId)
    }

    async handleMessage(userId: number, text: string): Promise<boolean> {
        const state = this.states.get(userId)
        if (!state) return false

        const scene = this.scenes.get(state.scene)
        if (!scene) {
            this.states.delete(userId)
            return false
        }

        state.step++
        if (state.step >= scene.steps.length) {
            this.states.delete(userId)
            return false
        }

        await scene.steps[state.step](userId, text, state)
        return true
    }

    leave(userId: number) {
        this.states.delete(userId)
    }

    setData(userId: number, key: string, value: any) {
        const state = this.states.get(userId)
        if (state) state.data[key] = value
    }
}

export default new SceneManager()
