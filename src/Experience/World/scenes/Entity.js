import Experience from "../../Experience";
import {Clock} from "three";

export default class Entity {
    _body;
    _shape;
    _mesh;
    _material;
    _geometry;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.clock = new Clock();
        this.camera = this.experience.camera.instance
    }

    getMesh(){
        return this._mesh;
    }

    setMesh(mesh){
        this._mesh = mesh;
    }

    getGeometry(){
        return this._geometry;
    }

    setGeometry(geometry){
        this._geometry = geometry;
    }

    getMaterial(){
        return this._material;
    }

    setMaterial(material){
        this._material = material;
    }

    getBody(){
        return this._body;
    }

    setBody(body){
        this._body = body;
    }

    getShape(){
        return this._shape;
    }

    setShape(shape){
        this._shape = shape;
    }
}
