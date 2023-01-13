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
    static finishedOnce = false;

    constructor() {
        super();
        if (Scene.instance)
            return Scene.instance;


        this.debug = this.experience.debug
        this.orangerMixer = null
        this.annotation = true
        this.objects = []
        this.htmlElement = []

        // this.camBack = document.querySelector(".camera-back")
        // this.camBack.addEventListener("click", () => {
        //     this.mouseHandler.clearCurrentObj(this.cameraStart)
        // })

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')

        }
    }

    initScene(sceneName) {
        this.sceneName = sceneName
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.inHome = false;
        this.mouseHandler.clearCurrentObj()
        if (sceneName == "oranger") {
            this.#sceneInfo = dataMap.orangerie.poi[sceneName].scene;
        }
        else {
            this.#sceneInfo = dataMap.montmartre.poi[sceneName].scene;
        }
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
        this.setGui(sceneName)
        // this.setBottomBar()
        // this.getObjectList()


    }

    getObjectList() {
        const objects = this.mouseHandler.getListObject()

        // set html element on each object with setAnotation function
        for (let i = 0; i < objects.length; i++) {
            this.objects.push(objects[i])
            // create div dependint objects length
            const div = document.createElement("div")
            div.classList.add("annotation")
            div.classList.add(objects[i])
            this.htmlElement.push(div)
            document.body.appendChild(div)



            // const htmlElement = document.createElement('div')
            // htmlElement.classList.add('annotation')
            // var position = this.setAnnotation(this.renderer, this.camera, object)
            // htmlElement.style.position = "absolute"
            // htmlElement.style.left = position.x + "px"
            // htmlElement.style.top = position.y  + "px"
        }

    }

    setAnnotation(renderer, camera, object3d) {
        const vector = new THREE.Vector3();
        object3d.getWorldPosition(vector).project(camera);
        const domRect = renderer.domElement.getBoundingClientRect();

        // On passe des coordonnées dans le repère normalisé (NDC) aux
        // coordonnées de l'écran
        vector.x = Math.round((vector.x + 1) / 2 * domRect.width) + domRect.left;
        vector.y = Math.round((1 - vector.y) / 2 * domRect.height) + domRect.top;

        return vector;
    }

    setBottomBar() {
        if (this.sceneName) {
            const bottomBar = document.querySelector('.bottomBar')

            bottomBar.addEventListener('mouseenter', (event) => {
                gsap.to(
                    bottomBar, {
                    duration: 1,
                    y: "0%",
                    transformOrigin: "center center",
                    background: "#FDF9F0",
                    ease: "power4.out"
                }
                )
            });
            bottomBar.addEventListener('mouseleave', (event) => {
                gsap.to(
                    bottomBar, {
                    duration: 1,
                    y: "85%",
                    transformOrigin: "center center",
                    // background: "rgba(0,0,0,1)",
                    ease: "power4.out"
                }
                )
            })
        }

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


    }

    setAudio() {
        this.startAudio = document.querySelector(".start-audio.scene")
        this.audioHandler.initInput(this.startAudio)
    }

    setUi(isIn) {
        this.objectContainer = document.querySelector(".objects-description")
        this.objectTitle = document.querySelector(".object-title")
        this.objectContent = document.querySelector(".object-content")



        if (isIn) {
            this.objectTitle.innerHTML = this.#sceneInfo.description[MouseHandler.currentObj.name].title
            this.objectContent.innerHTML = this.#sceneInfo.description[MouseHandler.currentObj.name].text
            gsap.to(
                this.objectContainer,
                {
                    x: "-135%",
                    opacity: 1,
                    duration: 1,
                    ease: "power4.easeInOut",
                }

            )
        } else {
            gsap.to(
                this.objectContainer,
                {
                    x: "160%",
                    opacity: 1,
                    duration: 1,
                    ease: "power4.easeOut",
                }
            )
        }




    }

    #setCurrentScene() {
        this._mesh = this.model.scene
        this._mesh.position.set(this.#sceneInfo.position.x, this.#sceneInfo.position.y, this.#sceneInfo.position.z)
        if (this.sceneName == "laurencin") {
            this._mesh.rotation.y = 1.8
        }
        else if (this.sceneName == "utrillo") {
            this._mesh.rotation.y = 5
            this._mesh.scale.set(2, 2, 2)
        }
        else if (this.sceneName == "garage") {
            gsap.to(
                ".lettre-container",
                {
                    bottom: '0%',
                    duration: 1.5,
                    ease: "power4.out"
                }
            )
        }
        else if (this.sceneName == "oranger") {
            this.orangerMixer = new THREE.AnimationMixer(this.model.scene)
            const clips = this.model.animations
            const clip = THREE.AnimationClip.findByName(clips, 'MorphBake');
            this.action = this.orangerMixer.clipAction(clip)

            this.action.play()
            const lettreFin = document.querySelector(".lettreGarage")
            lettreFin.src = "ui/Lettre-fin.png"
            gsap.to(
                ".lettre-container",
                {
                    bottom: '0%',
                    duration: 1.5,
                    ease: "power4.out"
                }
            )
        }
        this.#addObjectList()
        this.scene.add(this._mesh)
    }

    #addObjectList() {
        const mouseHandler = new MouseHandler();
        mouseHandler.clearListObjects()
        const tabObj = [];
        this.#sceneInfo.objList.forEach(obj => {
            let objCurrent = this._mesh.getObjectByName(obj);
            if (objCurrent) tabObj.push(objCurrent);
        })
        mouseHandler.addObjects(tabObj)
    }

    update() {
        if (this.model && this.sceneName == "oranger") {
            this.orangerMixer.update(this.clock.getDelta() * 0.5)
        }
        if (AudioHandler.audio && AudioHandler.audio._duration) {
            console.log(AudioHandler.audio._duration)
        }
        if (this.world.state != "map" && this.mouseHandler) {
            // this.getObjectList()
            // this.annotation = false
            // console.log(this.objects, this.htmlElement);
            // this.objects.forEach(obj => {
            //     const position = this.setAnnotation(this.renderer, this.camera, obj)
            //     this.htmlElement.forEach(element, () => {
            //         element.style.left = position.x + "px";
            //         element.style.top = position.y + "px";


            //     })
            // })
        }

    }
}