
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

    constructor() {
        super();
        if (Scene.instance)
            return Scene.instance;


        this.debug = this.experience.debug
        this.canTransit = false

        this.camBack = document.querySelector(".camera-back")
        this.camBack.addEventListener("click", () => {
            this.mouseHandler.clearCurrentObj(this.cameraStart)
         if(!MouseHandler.currentObj){
            console.log("back");
            gsap.to(
                this.objectContainer,
                {
                    x: "160%",
                    opacity: 0,
                    duration: 2,
                    ease: "none",
                }
            )
         }
        })

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')

        }
    }

    initScene(sceneName) {
        console.log(sceneName)
        this.sceneName = sceneName
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.inHome = false;
        this.mouseHandler.clearCurrentObj()
        this.#sceneInfo = dataMap.montmartre.poi[sceneName].scene;
        this.camera.position.set(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.cameraStart = new THREE.Vector3(this.#sceneInfo.cameraPos.x, this.#sceneInfo.cameraPos.y, this.#sceneInfo.cameraPos.z)
        this.experience.camera.initPosition = this.cameraStart.clone();
        this.experience.camera.lookAtPosition = new THREE.Vector3();
        this.experience.camera.controls.enabled = false;
        this.model = this.resources.items[sceneName]
        this.audioHandler = new AudioHandler();
        this.audioHandler.setAudio(this.#sceneInfo.audio, this.#sceneInfo.subtitle)
        this.experience.camera.setParametersIsHome(false);
        this.#setCurrentScene()
        this.setAudio()

    }

    setGui(sceneName) {
        if (this.debug.active && this.model) {
            this.debugFolder = this.debug.ui.addFolder(sceneName)
            this.debugFolder.add(this.model.scene.position, 'x').min(-50).max(50).step(0.0001).name('positionX')
            this.debugFolder.add(this.model.scene.position, 'y').min(-50).max(50).step(0.0001).name('positionY')
            this.debugFolder.add(this.model.scene.position, 'z').min(-50).max(100).step(0.0001).name('positionZ')
            // rotation
            this.debugFolder.add(this.model.scene.rotation, 'x').min(0).max(Math.PI * 2).step(0.0001).name('rotationX')
            this.debugFolder.add(this.model.scene.rotation, 'y').min(0).max(Math.PI * 2).step(0.0001).name('rotationY')
            this.debugFolder.add(this.model.scene.rotation, 'z').min(0).max(Math.PI * 2).step(0.0001).name('rotationZ')
        }
        if (sceneName === "laurencin" && this.model) {
            this.model.scene.rotation.y = 1.8

        }
        if (sceneName === "utrillo" && this.model) {
            this.model.scene.rotation.y = 5
            this.model.scene.scale.set(2, 2, 2)

        }

    }






setAudio() {
    this.startAudio = document.querySelector(".start-audio.scene")
    this.audioHandler.initInput(this.startAudio)
}

setUi() {
    this.objectContainer = document.querySelector(".objects-description")
    this.objectTitle = document.querySelector(".object-title")
    this.objectContent = document.querySelector(".object-content")


    if (MouseHandler.currentObj) {

        this.objectTitle.innerHTML = this.#sceneInfo.description[MouseHandler.currentObj.name].title
        this.objectContent.innerHTML = this.#sceneInfo.description[MouseHandler.currentObj.name].text
       

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
    } 
}

#setCurrentScene() {
    this.#currentScene = this.model.scene
    this.#currentScene.position.set(this.#sceneInfo.position.x, this.#sceneInfo.position.y, this.#sceneInfo.position.z)
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
    console.log(tabObj)
}

update() {
    if (this.sceneName && MouseHandler.currentObj && MouseHandler.currentObj.name != this.sceneName) {
        console.log(MouseHandler.currentObj.name, this.sceneName);
        this.setUi()
    }

}
}

