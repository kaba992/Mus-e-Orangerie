// PencilLinesMaterial.ts
import * as THREE from "three";
import vertexShader from '../shaders/pencilLine/vertex.glsl'
import fragmentShader from '../shaders/pencilLine/fragment.glsl'

export class PencilLinesMaterial extends THREE.ShaderMaterial {
    constructor(texture) {
        super({
            uniforms: {
                // we'll keep the naming convention here since the CopyShader
                // also used a tDiffuse texture for the currently rendered scene.
                tDiffuse: { value: null },
                // we'll pass in the canvas size here later
                uResolution: {
                    value: new THREE.Vector2(1, 1)
                },
                uNormals: {
                    value: null
                },
                tCloud: {
                    value: texture
                },
                uColor: {
                    value: new THREE.Color("#efe6d5")
                },
                uDepth: {
                    value: null
                }
            },
            fragmentShader, // to be imported from another file
            vertexShader // to be imported from another file
        })
    }
}