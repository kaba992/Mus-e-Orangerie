import * as THREE from "three"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"
import Experience from "../../Experience"


// console.log(Renderer);
export default class Home {
    constructor() {
        this.experience = new Experience()
        this.scene = new THREE.Scene()
        this.scene.name = "home"
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.scene)
        this.sceneManager.add(this)
        // this.sceneManager.switchTo(SCENES.HOME)
        

    }
    init() {
        this.addSphere()
        this.canRender = false
    }
    addSphere() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        console.log(this.sphere);

    }

    update() {
        if (this.canRender) {
            this.renderer.update()
            console.log("in Home Scene")

        }
    }
}

