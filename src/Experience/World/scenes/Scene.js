
import * as THREE from "three"
import Experience from "../../Experience"
import gsap from "gsap"

import Entity from "./Entity";
import dataMap from "../../Utils/dataMap.json"
import MouseHandler from "../MouseHandler";
import AudioHandler from "../AudioHandler";

export default class Scene extends Entity {
    static instance = null;
    #sceneInfo
    #currentScene

    constructor(sceneName) {
        super();
        if(Scene.instance)
            return Scene.instance;

        this.initScene(sceneName)

        this.debug = this.experience.debug

        this.#setCurrentScene()
        this.setDom()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')
        }
    }

    initScene(sceneName){
        this.#sceneInfo = dataMap.montmartre.poi[sceneName].scene;
        this.camera.position.set(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.cameraStart = new THREE.Vector3(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.experience.camera.initPosition = this.cameraStart.clone();
        this.model = this.resources.items[sceneName]
        this.audioHandler = new AudioHandler();
        this.audioHandler.setAudio(this.#sceneInfo.audio)
        this.mouseHandler = new MouseHandler();
        this.experience.camera.setParametersIsHome(false);
    }

    setDom() {
        this.camBack = document.querySelector(".camera-back")
        this.startAudio = document.querySelector(".start-audio.scene")
        this.audioHandler.initInput(this.startAudio)

        this.camBack.addEventListener("click", () => {
            this.mouseHandler.clearCurrentObj(this.cameraStart)
        })
    }

    #setCurrentScene() {
        this.#currentScene = this.model.scene
        this.#currentScene.position.set(0, -2, 0)
        this.#addObjectList()
        this.scene.add(this.#currentScene)
    }

    #addObjectList(){
        const mouseHandler = new MouseHandler();
        mouseHandler.clearListObjects()
        const tabObj = [];
        this.#sceneInfo.objList.forEach(obj => {
            let objCurrent = this.#currentScene.getObjectByName(obj);
            if(objCurrent) tabObj.push(objCurrent);
        })
        mouseHandler.addObjects(tabObj)
    }




    update() {

    }
}

