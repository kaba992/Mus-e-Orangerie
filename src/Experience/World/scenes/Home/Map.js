import * as THREE from "three"
import Entity from "../Entity";
import fragmentShader from '../../../../shaders/map/fragment.glsl'
import vertexShader from '../../../../shaders/map/vertex.glsl'
import PointOfInterest from "./PointOfInterest"
import dataMap from '/src/Experience/Utils/dataMap.json';
import MouseHandler from "../../MouseHandler";

export default class Map extends Entity{
    static SIZE = 100;
    mapName = null;
    ratio = 1;
    pois = {};

    constructor(mapName) {
        super();
        this.mapName = mapName;

        this.experience.camera.setParametersIsHome(true)

        this.#createMap()
        const axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)
    }

    #setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items[this.mapName]
        if(this.textures.color){
            const dataTexture = this.textures.color.source.data
            this.ratio = dataTexture.width / dataTexture.height  ;
        }
        this.mapWidth = Map.SIZE*this.ratio;
        this.mapHeight = Map.SIZE;
    }

    #setMesh(){
        this._geometry = new THREE.PlaneGeometry( this.mapWidth, this.mapHeight );
        this._material =  new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uTexture: {value: this.textures.color},
                uTime1: {value:0}
            },
            side: THREE.DoubleSide
        })
        this._mesh = new THREE.Mesh(this._geometry,this._material)
        this._mesh.rotation.x = -Math.PI * 0.5

        this._mesh.geometry.computeBoundingBox()
        const boundingBoxMax = this._mesh.geometry.boundingBox.max
        this._mesh.geometry.translate(
            boundingBoxMax.x,
            boundingBoxMax.y,
            0
        )

        this._mesh.position.set(-(boundingBoxMax.x/2),0,(boundingBoxMax.y/2)-10)
        this._mesh.receiveShadow = true;
    }

    start(){
        if(this.mapName == "montmatre"){
            const positionCam = dataMap[this.mapName].positionCam
            this.experience.camera.initPosition = new THREE.Vector3(positionCam.x, positionCam.y, positionCam.z)
        }
        this.mouseHandler = new MouseHandler();
        this.mouseHandler.clearListObjects()
        this.mouseHandler.inHome = true;
        this.#setPois()
    }

    #setPois(){
        const pois = dataMap[this.mapName].poi;
        for (const [key, value] of Object.entries(pois)) {
            this.pois[key] = value;
            const position = this.pois[key].position;
            this.pois[key].poi = new PointOfInterest(this,[position.xNormal,position.yNormal],key)
            this.mouseHandler.addObject(this.pois[key].poi.getMesh())
            this.mouseHandler.addKeyObject(key);
        }
    }

    #createMap() {
        this.#setTextures();
        this.#setMesh()

    }

    setPosition(){
        const pos = dataMap[this.mapName].position
        this._mesh.position.set(-50-pos.x,0,50+pos.z);
    }

    update() {
        // if(this.mouseHandler && this.mouseHandler.getIntersection()){
        //     if(this.mouseHandler.getIntersection().name != "image")
        // }
        if(this._mesh){
            this._material.uniforms.uTime1.value = this.clock.getElapsedTime()
        }
    }
}

