
import * as THREE from "three"
import SCENES from "../../Utils/SCENES"
import Experience from "../../Experience"
import { Vector2 } from "three"
import gsap from "gsap"


export default class Garage {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera.instance
        this.camera.position.set(20.5, 4.52, 10.66)
        this.cameraStart = new THREE.Vector3(20.5, 4.52, 10.66)
        this.debug = this.experience.debug
        this.model1 = this.resources.items.garage
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2()
        this.maxFocus = 2
        this.currentIntersect = null
        this.targetPos = new THREE.Vector3()
        this.initialLookAt = new THREE.Vector3(0, 0, 0)
        this.currentLookAt = this.initialLookAt.clone()

        this.canLerp = true
        this.inLerp = false
        this.addGarage()
        this.setMouse()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('camera')
            this.debugFolder.add(this.camera.position, 'x').min(-50).max(50).step(0.01).name('positionX')
            this.debugFolder.add(this.camera.position, 'y').min(-50).max(50).step(0.01).name('positionY')
            this.debugFolder.add(this.camera.position, 'z').min(-50).max(50).step(0.01).name('positionZ')
        }


    }

    addGarage() {

        this.garage = this.model1.scene
        this.garage.scale.set(1, 1, 1)
        this.garage.position.set(0, -2, 0)
        this.garageObjects = []
        const mask1 = this.garage.getObjectByName("masque1.001")
        const mask2 = this.garage.getObjectByName("Masque_Low__0")
        mask2.name = "mask2"
        const pneus = this.garage.getObjectByName("pneus")
        pneus.name = "pneus"
        console.log(pneus.position);
        const cadre = this.garage.getObjectByName("photo_guillaume")
        cadre.name = "cadre"
        this.garageObjects = []
        this.garageObjects.push(mask2, pneus, cadre)

        console.log(this.garageObjects);

        this.scene.add(this.garage)

    }
    setMouse() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        })
    }

    lerpPos(object) {
        this.canLerp = false
        window.addEventListener('click', () => {
            // transform object position to world
            if (!this.canLerp && !this.inLerp) {
                object.getWorldPosition(this.targetPos)
                console.log(this.targetPos);
                this.inLerp = true

            }

        })
    }



    update() {
        this.camera.lookAt(this.currentLookAt)

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.garageObjects, true);
        this.currentIntersect = intersects[0]
        const intersect = intersects[0]
        if (this.inLerp) {
            const distance = this.camera.position.distanceTo(this.targetPos)
            
            if (distance <= 8) return
            this.camera.position.lerp(this.targetPos, 0.005)
            this.currentLookAt.lerp(this.targetPos, 0.005)

        }
        if (intersects.length) {
            if (this.currentIntersect) {
                
                if (intersect.object.name === "pneus" && this.canLerp) {
                    this.lerpPos(intersect.object)

                    console.log(intersect.object.name);
                }
                else if (intersect.object.name === "cadre" && this.canLerp) {
                    this.lerpPos(intersect.object)
                    console.log(intersect.object.name);

                }
                else if (intersect.object.name === "mask2" && this.canLerp) {
                    this.lerpPos(intersect.object)
                    console.log(intersect.object.name);

                }
            }
            else {
                if (this.currentIntersect) {
                    // this.currentIntersect.object.material.color.set(0xff0000);

                    console.log('mouse leave')
                }

                this.currentIntersect = null
            }


        }

    }

}

