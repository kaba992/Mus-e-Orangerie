import Entity from "./scenes/Entity";
import SCENE from "../Utils/SCENES"
import {
    Raycaster,
    Vector2,
    Color, MeshStandardMaterial, Vector3
} from "three";

import dataMap from "../Utils/dataMap.json"

export default class MouseHandler extends Entity {
    static currentObjPost = null;
    static currentObj = null;
    static instance = null;
    #raycaster;
    #mouse;
    #listObject = []
    #listKeyobject = []
    #intersects
    inHome = true;
    objNav = ["utrillo",'laurencin',"garage","oranger"]


    constructor() {
        super();
        if (MouseHandler.instance)
            return MouseHandler.instance;
        else{
            this.#raycaster = new Raycaster();
            this.#mouse = new Vector2();
            this.cameraObj = this.experience.camera;
            this.#raycaster.setFromCamera(this.#mouse, this.camera);
            this.#handleMouseMove();
            this.#handlePoseClick()
            MouseHandler.instance = this;
        }

    }

    addObject(object) {
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
        })
    }

    targetCameraEvent() {
        if (this.cameraObj.lookAtPosition.distanceTo(MouseHandler.currentObjPost) > 0.1) {
            this.cameraObj.lookAtPosition.lerp(MouseHandler.currentObjPost, 0.05)

            if (MouseHandler.currentObj) {
                if (this.camera.position.distanceTo(MouseHandler.currentObjPost) > 8){
                    this.camera.position.lerp(MouseHandler.currentObjPost, 0.01);
                }
            }
            else{
                this.camera.position.lerp(this.experience.camera.initPosition,0.1);
            }
        }
        else if((this.camera.position.distanceTo(this.experience.camera.initPosition) > 2 && !MouseHandler.currentObj && !this.cameraObj.isHome)) {
            this.camera.position.lerp(this.experience.camera.initPosition,0.1);
        }
        else{
            if(MouseHandler.currentObj && this.objNav.includes(MouseHandler.currentObj.name) && !this.world.inTrans){
                    this.world.inTrans = true;
                    this.world.initSceneState(MouseHandler.currentObj.name);
            }
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
                if(this.#listKeyobject){
                    this.world.transitionTitle(MouseHandler.currentObj.name)
                }
                if(!this.inHome){
                    this.world.scenePoi.setUi(true)
                }
            }
            else if(MouseHandler.currentObj && this.#intersects.length < 1){
                console.log(this.inHome)
                if(this.inHome){
                    this.cameraObj.setParametersIsHome(true);
                    this.experience.camera.controls.enabled = true;
                }
                else{
                    this.world.scenePoi.setUi(false)
                }
                this.clearCurrentObj();
                if(this.world.counter <= 3 && this.inHome){
                    this.world.transitionTitle("montmartre")
                }
                else if(this.world.counter > 3 && this.inHome){
                    this.world.transitionTitle("orangerie")
                }

            }
        })
    }

    getCurrentObject(){
        return MouseHandler.currentObj
    }

    clearCurrentObj(){
        this.#listKeyobject = []
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
        if ( MouseHandler.currentObjPost) {
            this.targetCameraEvent()
        }
    }


}