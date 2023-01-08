import Experience from "../../Experience"
import * as THREE from "three"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Urtillo {
    constructor() {
        // this.experience = new Experience()
        this.sceneUrtillo = new THREE.Scene()
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.sceneUrtillo)
        this.sceneManager.add(SCENES.URTILLO, this.sceneUrtillo)
    }
    init() {
       
        this.addPlane()

    }

    addPlane(){
        const geometry = new THREE.PlaneGeometry(5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.plane = new THREE.Mesh(geometry, material);
        this.sceneUrtillo.add(this.plane);
    }
    update() {
       console.log("in Urtillo Scene")
         this.renderer.update()
       

    }
}

