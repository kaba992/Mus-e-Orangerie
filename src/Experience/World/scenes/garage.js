
import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Experience from "../../Experience"



export default class Garage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.resource = this.resources.items.garage
        this.addGarage()

    }

    addGarage() {
       
        this.garage = this.resource.scene
        console.log(this.garage);
        this.garage.scale.set(1, 1, 1)
        this.garage.position.set(0, 0, 0)
        this.scene.add(this.garage)

    }


    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }
    update() {


    }

}

