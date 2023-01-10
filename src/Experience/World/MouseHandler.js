import Entity from "./Entity";
import {
    Raycaster,
    Vector2,
    Color, MeshStandardMaterial
} from "three";
import keyObjects,{contentObjects} from "../../Utils/KeyObjets";

export default class MouseHandler extends Entity{
    static instance = null;
    #raycaster;
    #mouse;
    #listObject = []
    #listMesh = []
    #intersects
    targetCamera = null;

    constructor() {
        super();
        if(MouseHandler.instance)
            return MouseHandler.instance;
        this.#raycaster = new Raycaster();
        this.#mouse = new Vector2();
        this.#raycaster.setFromCamera(this.#mouse, this.camera);
        this.#handleMouseMove();
        this.#handlePoseClick()
    }

    addObject(object){
        this.#listObject.push(object)
    }

    addMesh(mesh){
        this.#listMesh.push(mesh);
    }

    #handleMouseMove() {
        window.addEventListener('mousemove', (e) => {

            this.#intersects = this.#raycaster.intersectObjects(this.#listMesh);
            this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.#raycaster.setFromCamera(this.#mouse, this.camera);
        })
    }

    // #modifyHUD(object){
    //     document.querySelectorAll(".graph").forEach(elt => {
    //         if(elt.classList.contains(object.name)){
    //             elt.classList.remove("hidden");
    //         }
    //         else{
    //             elt.classList.add("hidden");
    //         }
    //     })
    //     const subline = document.querySelector(".leftInfo .subline")
    //     subline.querySelector("h1").innerHTML = contentObjects[object.name].title + " <span>?</span>";
    //     subline.querySelector("p").innerHTML = contentObjects[object.name].content;
    // }

    #handlePoseClick() {
        window.addEventListener('click', (e) => {
            if (this.#intersects && this.#intersects.length > 0 && this.globalWorld.currentPart == 2 && !this.globalWorld.animInFocus) {
                this.experience.camera.controls.enabled = false;
                if(!keyObjects.includes(this.#intersects[0].object.name)){
                    this.globalWorld.targetCamera = this.#intersects[0].object.parent.position
                    this.#modifyHUD(this.#intersects[0].object.parent)
                }
                else{
                    this.globalWorld.targetCamera = this.#intersects[0].object.position
                    this.globalWorld.currentObj =  this.#intersects[0].object
                    this.#modifyHUD(this.#intersects[0].object)
                }
            }
        })
    }

    update() {
        // if (this.#intersects &&  this.#intersects.length > 0) {
        //     if(this.globalWorld.currentPart == 2 && !this.globalWorld.currentObj){
        //         if(!keyObjects.includes(this.#intersects[0].object.name)){
        //             this.composer.addSelectedObject(this.#intersects[0].object.parent);
        //         }
        //         else{
        //             this.composer.addSelectedObject(this.#intersects[0].object);
        //         }
        //     }
        // }
        // else if(this.composer.selectedObjectsEmpty()){
        //     this.composer.removeSelectedObject();
        // }
    }


}