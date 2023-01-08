
import * as THREE from "three"
// import Experience from "../../Experience"
import SceneManager from "./sceneManager"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Garage {
    constructor() {
        // this.experience = new Experience()
        this.GarageScene = new THREE.Scene();
        this.sceneManager = new SceneManager()
        this.renderer = new Renderer(this.GarageScene)
        this.sceneManager.add(SCENES.GARAGE, this.GarageScene)

    }
    init() {
        
        this.addCube()
      
    }

    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.GarageScene.add(this.cube);
    }
    update() {
        console.log("in Garage Scene")
        this.renderer.update()
    }

}

