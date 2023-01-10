import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 500)
        this.instance.position.set(0, 100, 20)
        this.instance.lookAt(0,0,0)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        // this.controls.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

        // this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        // this.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        // this.controls.touches.ONE = THREE.TOUCH.PAN;
        // this.controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

        this.controls.enableDamping = true
        this.controls.enablePan = false;
        // this.controls.minDistance = 50
        // this.controls.maxDistance = 100
        // this.controls.maxPolarAngle = Math.PI/3 -Math.PI/10
        // this.controls.minPolarAngle = Math.PI/6
        // this.controls.maxAzimuthAngle = 0
        // this.controls.minAzimuthAngle = -Math.PI/9
        this.controls.enableRotate = true;
    }
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}