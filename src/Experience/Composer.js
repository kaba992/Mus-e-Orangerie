import * as THREE from 'three';

import Experience from "./Experience";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {PencilLinesPass} from "../PencilLine/PencilLinesPass";


export default class Composer{

    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.renderer = this.experience.renderer;
        this.#setInstance();
    }

    #setInstance(){
        this.instance = new EffectComposer(this.renderer.instance);

        this.renderPass = new RenderPass(this.scene,this.camera.instance);
        this.pencilLinesPass = new PencilLinesPass([{width: this.renderer.sizes.width,height: this.renderer.sizes.height},this.scene,this.camera.instance])
        this.instance.addPass(this.renderPass)
        this.instance.addPass(this.pencilLinesPass)
    }

    update(){
        if(this.instance){
            this.instance.render();
        }
    }

}