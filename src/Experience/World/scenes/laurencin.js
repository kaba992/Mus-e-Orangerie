import Experience from "../../Experience"
import * as THREE from "three"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Laurencin {
    constructor() {
        // this.experience = new Experience()
        this.scene = new THREE.Scene()
        this.scene.name = "laurencin"
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.scene)
        this.sceneManager.add(this)
        // this.sceneManager.switchTo(SCENES.LAURENCIN)
    }

    init() {

        this.addCylinder()
        this.canRender = false


    }

    addCylinder() {

        const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.cylinder = new THREE.Mesh(geometry, material);
        this.scene.add(this.cylinder);
    }

    update() {
        if (this.canRender) {
            this.renderer.update()
            console.log("in Laurencin Scene");


        }

    }
}

