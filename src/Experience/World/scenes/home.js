import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Experience from "../../Experience"


// console.log(Renderer);
export default class Home {
    constructor() {
        this.experience = new Experience()
     
    }
 
    addSphere() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        console.log(this.sphere);

    }

    update() {
    
    }
}

