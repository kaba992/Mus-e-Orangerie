import Experience from "../../Experience"
import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Laurencin {
    constructor() {
        // this.experience = new Experience()
   
    }

   

    addCylinder() {

        const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.cylinder = new THREE.Mesh(geometry, material);
        this.scene.add(this.cylinder);
    }

    update() {
    

    }
}

