import Experience from "../../Experience"
import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Renderer from "../../Renderer"


export default class Urtillo {
    constructor() {
  
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

