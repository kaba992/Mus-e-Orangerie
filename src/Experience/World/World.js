import Experience from '../Experience.js'
import Environment from './Environment.js'

import Garage from './scenes/garage.js'
import Laurencin from './scenes/laurencin.js'
import Urtillo from './scenes/urtillo.js'
import SCENES from '../Utils/SCENES'
import Home from './scenes/Home.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()
            // this.home = new Home();
            this.garage= new Garage()

        })
    }

    update() {
        if(this.garage){
            this.garage.update()
        }

    }
}