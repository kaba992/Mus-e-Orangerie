
import * as THREE from "three"
// import Experience from "../../Experience"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Garage {
    constructor() {
        // this.experience = new Experience()
        this.scene = new THREE.Scene();
        this.scene.name = "garage"

        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.scene)
        this.sceneManager.add(this)
        // this.sceneManager.switchTo(SCENES.GARAGE)

    }
    init() {
        
        this.addCube()
        this.canRender =false

      
    }

    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }
    update() {
        
        if(this.canRender){
            this.renderer.update()
            console.log("in Garage Scene")

        }
       
    }

}

