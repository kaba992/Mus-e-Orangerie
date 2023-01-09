
import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Experience from "../../Experience"



export default class Garage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.camera.position.set(20.5,8.21,23)
        this.debug = this.experience.debug
        this.resource = this.resources.items.garage
        this.addGarage()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')

            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')
        }


    }

    addGarage() {

        this.garage = this.resource.scene
        console.log(this.garage);
        this.garage.scale.set(1, 1, 1)
        this.garage.position.set(0, -2, 0)
        
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

