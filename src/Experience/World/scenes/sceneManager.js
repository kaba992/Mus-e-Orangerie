


class SceneManager {
    constructor() {
        this.currentScene = null
        this.scenes = []
    }

    add(scene) {
        this.scenes.push(scene)
        if (this.currentScene === null) {
            this.currentScene = scene
        }
    }

    switchTo(name) {
        this.scenes.forEach(scene => {
            console.log(scene);
            if (scene.scene.name == name) {
                this.currentScene = scene
                this.currentScene.init()
                this.currentScene.canRender = true    
            }else {
                this.currentScene.canRender = false
            }
        })
    }


    getCurrent() {
        return this.currentScene
    }



}

export default SceneManager