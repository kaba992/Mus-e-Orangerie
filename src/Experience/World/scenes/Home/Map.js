import * as THREE from "three"
import Entity from "../Entity";
import fragmentShader from '../../../../shaders/map/fragment.glsl'
import vertexShader from '../../../../shaders/map/vertex.glsl'
import PointOfInterest from "./PointOfInterest"
import dataMap from '/src/Experience/Utils/dataMap.json';
import MouseHandler from "../../MouseHandler";

export default class Map extends Entity {
    static SIZE = 100;
    mapName = null;
    ratio = 1;
    pois = {};
    poisMaterial = []

    constructor(mapName) {
        super();
        this.mapName = mapName;

        this.experience.camera.setParametersIsHome(true)

        this.#createMap()
    }

    #setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items[this.mapName]
        if (this.textures.color) {
            const dataTexture = this.textures.color.source.data
            this.ratio = dataTexture.width / dataTexture.height;
        }
        this.mapWidth = Map.SIZE * this.ratio;
        this.mapHeight = Map.SIZE;
    }

    #setMesh() {
        this._geometry = new THREE.PlaneGeometry(this.mapWidth, this.mapHeight);
        this._material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uTexture: { value: this.textures.color },
                uTime1: { value: 0 }
            },
            side: THREE.DoubleSide
        })
        this._mesh = new THREE.Mesh(this._geometry, this._material)
        this._mesh.rotation.x = -Math.PI * 0.5

        this._mesh.geometry.computeBoundingBox()
        const boundingBoxMax = this._mesh.geometry.boundingBox.max
        this._mesh.geometry.translate(
            boundingBoxMax.x,
            boundingBoxMax.y,
            0
        )

        this._mesh.position.set(-(boundingBoxMax.x / 2), 0, (boundingBoxMax.y / 2) - 10)
        this._mesh.receiveShadow = true;
    }

    start() {
        if (this.mapName == "montmatre") {
            this.resetPos()
        }
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.clearListObjects()
        this.mouseHandler.inHome = true;
        this.#setPois()
    }

    resetPos() {
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.clearCurrentObj()
        this.mouseHandler.inHome = true;
        const positionCam = dataMap[this.mapName].positionCam
        this.experience.camera.initPosition = new THREE.Vector3(positionCam.x, positionCam.y, positionCam.z)
        this.camera.position.set(positionCam.x, positionCam.y, positionCam.z)
        this.experience.camera.lookAtPosition = new THREE.Vector3()
        this.experience.camera.controls.enabled = true;
        this.experience.camera.setParametersIsHome(true);

        for (const [key, value] of Object.entries(this.pois)) {
            this.mouseHandler.addKeyObject(key);
            this.mouseHandler.addObject(this.pois[key].poi.getMesh())


        }
    }

    #setPois() {
        const pois = dataMap[this.mapName].poi;
        let index = 0;
        for (const [key, value] of Object.entries(pois)) {
            this.pois[key] = value;
            const position = this.pois[key].position;
            if (this.pois[key].position) {
                
                this.pois[key].poi = new PointOfInterest(this, [position.xNormal, position.yNormal], key)

                this.pois[key].poi.getMesh().name = key
                this.mouseHandler.addObject(this.pois[key].poi.getMesh())
                this.mouseHandler.addKeyObject(key);
                this.pois[key].material = this.pois[key].poi.getMesh().children[0].children[0].children[0].children[0].material.clone();
                this.pois[key].index = index;
                // if(key != "garage"){
                this.modifyPoisMaterial(key);

                // }
                index += 1;

            }
        }
    }

    modifyPoisMaterial(key) {
        // if(this.pois[key].index == this.world.counter) {

        let elt = this.pois[key].poi.getMesh().children[0].children[0].children[0].children[0];
        if (elt.material.color.r == this.pois[key].material.color.r && elt.material.color.g == this.pois[key].material.color.g && elt.material.color.b == this.pois[key].material.color.b) {
            elt.material = new THREE.MeshStandardMaterial({ color: new THREE.Color("#000000") })

        } else {
            elt.material = this.pois[key].material
        }
        // }
    }

    checkIsAvailable(key) {
        if (this.pois[key]) {
            return this.pois[key].index == this.world.counter
        }
        return false;
    }



    #createMap() {
        this.#setTextures();
        this.#setMesh()

    }

    setPosition() {
        const pos = dataMap[this.mapName].position
        this._mesh.position.set(-50 - pos.x, 0, 50 + pos.z);
    }

    update() {
    }
}