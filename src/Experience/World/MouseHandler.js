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
    #listKeyobject = []
    #intersects
    inHome = false;


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

    addObjects(objects){
        objects.forEach(object => this.addObject(object))
    }

    addKeyObject(key){
        this.#listKeyobject.push(key);
    }

    clearListObjects(){
        this.#listObject = [];
        this.#listKeyobject = []
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
            else{
                this.camera.position.lerp(this.experience.camera.initPosition,0.1);
            }

        }
        else if((this.camera.position.distanceTo(this.experience.camera.initPosition) > 0.1 && !MouseHandler.currentObj && !this.cameraObj.isHome) ||
            (this.camera.position.distanceTo(this.experience.camera.initPosition) < 18 && !MouseHandler.currentObj && this.cameraObj.isHome)
        ) {
            this.camera.position.lerp(this.experience.camera.initPosition,0.1);
        }
    }

    #handlePoseClick() {
        window.addEventListener('click', (e) => {

            if (this.#intersects && this.#intersects.length > 0) {
                this.experience.camera.controls.enabled = false;
                // this.#modifyHUD(this.#intersects[0].object)
                const pos = new Vector3();
                if(this.#listKeyobject.length > 0 && !this.#listKeyobject.includes(this.#intersects[0].object.name)){
                    this.#intersects[0].object.parent.getWorldPosition(pos)
                    MouseHandler.currentObjPost = pos
                    MouseHandler.currentObj  =  this.#intersects[0].object.parent
                }
                else{
                    this.#intersects[0].object.getWorldPosition(pos)
                    MouseHandler.currentObjPost = pos
                    MouseHandler.currentObj =  this.#intersects[0].object
                }
                if(this.inHome && this.cameraObj.isHome && MouseHandler.currentObj){
                    this.cameraObj.setParametersIsHome(false);
                }
            }
            else if(MouseHandler.currentObj && this.inHome && this.#intersects.length < 1){
                this.cameraObj.setParametersIsHome(true);
                this.experience.camera.controls.enabled = true;
                this.clearCurrentObj();
            }
        })
    }

    clearCurrentObj(){
        MouseHandler.currentObj = null;
        MouseHandler.currentObjPost =new Vector3(0,0,0)
    }

    getListObject(){
        return this.#listObject
    }

    getIntersection(){
        if(this.#intersects && this.#intersects.length > 0){
            return this.#intersects[0].object
        }
        return null;
    }

    update() {
        if(MouseHandler.currentObjPost){
            this.targetCameraEvent()
        }
    }


}