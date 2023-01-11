import Experience from '../Experience.js'
import Environment from './Environment.js'
import AudioHandler from "./AudioHandler";
import Scene from './scenes/Scene.js'
import SCENES from '../Utils/SCENES'
import Map from './scenes/Home/Map.js'
import MouseHandler from "./MouseHandler";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()
            this.montmartre = new Map("montmartre");
            this.audioHandler = new AudioHandler();
            this.mouseHandler = new MouseHandler();
            // this.garage = new Scene("garage")

        })
    }

    update() {
        if(this.montmartre) this.montmartre.update()
        if(this.audioHandler) this.audioHandler.update();
        if(this.mouseHandler) this.mouseHandler.update();
    }
}