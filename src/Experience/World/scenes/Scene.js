
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

    constructor() {
        super();
        if (Scene.instance)
            return Scene.instance;


        this.debug = this.experience.debug
        this.canTransit = false

        this.camBack = document.querySelector(".camera-back")
        this.camBack.addEventListener("click", () => {
            this.mouseHandler.clearCurrentObj(this.cameraStart)
        })

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')

        }
    }

    initScene(sceneName) {
        this.#sceneInfo = dataMap.montmartre.poi[sceneName].scene;
        this.camera.position.set(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.cameraStart = new THREE.Vector3(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.experience.camera.initPosition = this.cameraStart.clone();
        this.experience.camera.controls.enabled = false;
        this.model = this.resources.items[sceneName]
        this.audioHandler = new AudioHandler();
        this.audioHandler.setAudio(this.#sceneInfo.audio, this.#sceneInfo.subtitle)
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.inHome = false;
        this.experience.camera.setParametersIsHome(false);
        this.#setCurrentScene()
        this.setAudio()

    }

    setAudio() {
        this.startAudio = document.querySelector(".start-audio.scene")
        this.audioHandler.initInput(this.startAudio)
    }

    setUi() {
        this.objectContainer = document.querySelector(".objects-description")
        this.objectTitle = document.querySelector(".object-title")
        this.objectContent = document.querySelector(".object-content")
        this.object = this.mouseHandler.getCurrentObject()


        if (this.object) {
            this.objectTitle.innerHTML = this.#sceneInfo.description[this.object.name].title
            this.objectContent.innerHTML = this.#sceneInfo.description[this.object.name].text
            gsap.to(
                this.objectContainer,
                {
                    x: "-140%",
                    opacity: 1,
                    duration: 2,
                    ease: "power4.out",
                    delay: 1
                }
    
            )
        }else{
           setTimeout(() => {
            gsap.to(
                this.objectContainer,
                {
                    x: "160%",
                    opacity: 0,
                    duration: 2,
                    ease: "none",
                }
            )
            
           }, 500);
        }
    
    }

    #setCurrentScene() {
        this.#currentScene = this.model.scene
        this.#currentScene.position.set(0, -2, 0)
        this.#addObjectList()
        this.scene.add(this.#currentScene)
    }

    #addObjectList() {
        const mouseHandler = new MouseHandler();
        mouseHandler.clearListObjects()
        const tabObj = [];
        this.#sceneInfo.objList.forEach(obj => {
            let objCurrent = this.#currentScene.getObjectByName(obj);
            if (objCurrent) tabObj.push(objCurrent);
        })
        mouseHandler.addObjects(tabObj)
    }




    update() {
        this.setUi()

    }
}

