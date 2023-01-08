import Experience from "../../Experience"
import * as THREE from "three"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Urtillo {
    constructor() {
        // this.experience = new Experience()
        this.scene = new THREE.Scene()
        this.scene.name = "urtillo"
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.scene)
        this.sceneManager.add(this)
        this.sceneManager.switchTo(SCENES.HOME)
    }
    init() {
       
        this.addPlane()
        this.canRender = false

    }

    addPlane(){
        const geometry = new THREE.PlaneGeometry(5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);
    }
    update() {
         if(this.canRender){
            this.renderer.update()
       console.log("in Urtillo Scene")

         }
       

    }
}

