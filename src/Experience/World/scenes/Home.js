import * as THREE from "three"
import Entity from "./Entity";
import fragmentShader from '../../../shaders/map/fragment.glsl'
import vertexShader from '../../../shaders/map/vertex.glsl'

export default class Home extends Entity{
    constructor() {
        super();
        this.createMap()
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.mapColor
    }


    createMap() {
        this.setTextures();

        this._geometry = new THREE.PlaneGeometry( 100, 100 );
        this._material =  new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uTexture: {value: this.textures.color}
            },
            side: THREE.DoubleSide
        })
        this._mesh = new THREE.Mesh(this._geometry,this._material)
        this._mesh.rotation.x = Math.PI * 0.5
        console.log(fragmentShader)

        this.scene.add(this._mesh)
    }

    update() {

    }
}

