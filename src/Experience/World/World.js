import Experience from '../Experience.js'
import Environment from './Environment.js'

import Garage from './scenes/garage.js'
import Laurencin from './scenes/laurencin.js'
import Urtillo from './scenes/urtillo.js'
import SCENES from '../Utils/SCENES'
import Home from './scenes/home.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()

            this.garage = new Garage()
            this.laurencin = new Laurencin()
            this.urtillo = new Urtillo()


        })
    }

    update() {

        // this.home.update()

        if (this.garage) {
            this.garage.update()
        }
        if (this.laurencin) {
            this.laurencin.update()
        }
        if (this.urtillo) {
            this.urtillo.update()
        }

    }
}