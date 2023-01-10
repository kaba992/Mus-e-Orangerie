import Entity from "./scenes/Entity";
import {
    Raycaster,
    Vector2,
    Color, MeshStandardMaterial, Vector3
} from "three";

export default class MouseHandler extends Entity{
    static currentObjPost = null;
    static currentObj = null;
    static instance = null;
    #raycaster;
    #mouse;
    #listObject = []
    #listMesh = []
    #intersects


    constructor() {
        super();
        if(MouseHandler.instance)
            return MouseHandler.instance;
        this.#raycaster = new Raycaster();
        this.#mouse = new Vector2();
        this.cameraObj = this.experience.camera;
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

    addObjects(objects){
        objects.forEach(object => this.addObject(object))
    }

    clearListObjects(){
        this.#listObject = [];
    }

    #handleMouseMove() {
        window.addEventListener('mousemove', (e) => {

            this.#intersects = this.#raycaster.intersectObjects(this.#listObject);
            this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.#raycaster.setFromCamera(this.#mouse, this.camera);

            // if(this.#intersects.length > 0) console.log(this.#intersects[0].object.name)
        })
    }

    targetCameraEvent(){
        if(this.cameraObj.lookAtPosition.distanceTo(MouseHandler.currentObjPost) > 0.1){
            this.cameraObj.lookAtPosition.lerp(MouseHandler.currentObjPost,0.05)
            if( MouseHandler.currentObj){
                if(this.camera.position.distanceTo(MouseHandler.currentObjPost) > 8)
                    this.camera.position.lerp(MouseHandler.currentObjPost,0.01);
            }
            else {
                this.camera.position.lerp(this.experience.camera.initPosition,0.1);
                console.log("hihi")
            }

        }
        else if(this.camera.position.distanceTo(this.experience.camera.initPosition) > 0.5 && !MouseHandler.currentObj) {
            this.camera.position.lerp(this.experience.camera.initPosition,0.1);
            console.log("hihi")
        }

        // else if(this.initialPosition.distanceTo(this.currentObjPost) <=  0.1 && this.currentObj ){
        //     if(!this.animInFocus)
        //         this.animFocus();
        // }

    }

    #handlePoseClick() {
        window.addEventListener('click', (e) => {
            if (this.#intersects && this.#intersects.length > 0) {
                this.experience.camera.controls.enabled = false;
                MouseHandler.currentObjPost = this.#intersects[0].object.position
                MouseHandler.currentObj =  this.#intersects[0].object
                // this.#modifyHUD(this.#intersects[0].object)
            }
        })
    }

    clearCurrentObj(initPos){
        MouseHandler.currentObj = null;
        // this.experience.camera.controls.enabled = true;
        this.cameraObj.initPosition = new Vector3(initPos.x, initPos.y, initPos.z);
        MouseHandler.currentObjPost =new Vector3(0,0,0)
        console.log(this.camera.position.distanceTo(this.experience.camera.initPosition))
    }

    update() {
        if(MouseHandler.currentObjPost){
            this.targetCameraEvent()
        }
    }


}