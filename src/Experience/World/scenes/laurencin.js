import Experience from "../../Experience"
import * as THREE from "three"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Laurencin {
    constructor() {
        // this.experience = new Experience()
        this.sceneLaurencin = new THREE.Scene()
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.sceneLaurencin)
       
        this.sceneManager.add(SCENES.LAURENCIN, this.sceneLaurencin)
    }

    init() {
        
        this.addCylinder()

    }

    addCylinder() {

        const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.cylinder = new THREE.Mesh(geometry, material);
        this.sceneLaurencin.add(this.cylinder);
    }

    update() {
        console.log("in Laurencin Scene");
        this.renderer.update()

    }
}

