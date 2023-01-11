// import * as THREE from "three"
// import Entity from "../Entity";
// import fragmentShader from '../../../../shaders/image/fragment.glsl'
// import vertexShader from '../../../../shaders/image/vertex.glsl'
// import Map from './Map'

// export default class PointOfInterest extends Entity{
//     static height = 7.5;
//     position = [0,0];
//     parent;

//     constructor(parent,position) {
//         super();
//         this.parent = parent;
//         this.#setPosition(position)

//         this.#createPoi()

//     }

//     #setPosition(position){
//         this.position[0] = position[0] * Map.SIZE * this.parent.ratio;
//         this.position[1] = position[1] * Map.SIZE;
//         console.log(this.position)
//     }

//     #createPoi() {
//         // this.setTextures();
//         console.log(this.resources.items.poi)
//         this._mesh = new THREE.Group();

//         this.needle = this.resources.items.poi.scene.clone()
//         this.needle.position.set(0,0,PointOfInterest.height)
//         this.needle.rotation.set(Math.PI+Math.random()*0.25,Math.random()*0.25,Math.random()*0.25)
//         // this.needle.translateZ(1)
//         this.needle.scale.multiplyScalar(75)
//         this._mesh.add(this.needle)

//         const geometry = new THREE.CircleGeometry( 5, 32 );
//         const material = new THREE.MeshBasicMaterial({color:0xFF0000})
//         this.contactZone = new THREE.Mesh(geometry,material)
//         this.contactZone.position.set(0,0,0.1)
//         this.contactZone.visible = false;
//         this._mesh.add(this.contactZone)

//         this._mesh.position.set(this.position[0],this.position[1],0)
//         this.parent.getMesh().add(this._mesh)
//     }


//     update() {
//     }
// }

