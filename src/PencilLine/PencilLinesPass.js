import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import * as THREE from 'three'
import {PencilLinesMaterial} from "./PencilLinesMaterial";

export class PencilLinesPass extends Pass {
    fsQuad
    material

    constructor([{width,height},scene,camera]) {
        super()
        this.scene = scene;
        this.camera = camera;

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('/textures/cloud.png')

        this.material = new PencilLinesMaterial(texture)
        this.fsQuad = new FullScreenQuad(this.material)

        this.material.uniforms.uResolution.value = new THREE.Vector2(width, height)

        const normalBuffer = new THREE.WebGLRenderTarget(width, height)

        normalBuffer.texture.format = THREE.RGBAFormat
        normalBuffer.texture.type = THREE.HalfFloatType
        normalBuffer.texture.minFilter = THREE.NearestFilter
        normalBuffer.texture.magFilter = THREE.NearestFilter
        normalBuffer.texture.generateMipmaps = false
        normalBuffer.stencilBuffer = false
        this.normalBuffer = normalBuffer

        this.normalMaterial = new THREE.MeshNormalMaterial()
    }


    dispose(){
        this.material.dispose();
        this.fsQuad.dispose();
    }

    render(
        renderer,
        writeBuffer,
        readBuffer
    ) {
        this.material.uniforms['tDiffuse'].value = readBuffer.texture

        renderer.setRenderTarget(this.normalBuffer)
        const overrideMaterialValue = this.scene.overrideMaterial

        this.scene.overrideMaterial = this.normalMaterial
        renderer.render(this.scene, this.camera)
        this.scene.overrideMaterial = overrideMaterialValue

        this.material.uniforms.uNormals.value = this.normalBuffer.texture
        this.material.uniforms.tDiffuse.value = readBuffer.texture


        if (this.renderToScreen) {
            renderer.setRenderTarget(null)
            this.fsQuad.render(renderer)

        } else {
            renderer.setRenderTarget(writeBuffer)
            if (this.clear) renderer.clear()
            this.fsQuad.render(renderer)
        }
    }
}