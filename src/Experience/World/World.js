import Experience from '../Experience.js'
import Environment from './Environment.js'

import Garage from './scenes/garage.js'
import SCENES from '../Utils/SCENES'
import Map from './scenes/Home/Map.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()
            // this.montmartre = new Map("montmartre");
            this.garage = new Garage()

        })
    }

    update() {
        if(this.garage){
            this.garage.update()
        }

    }
}