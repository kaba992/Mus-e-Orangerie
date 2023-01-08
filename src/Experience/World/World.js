import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Garage from './scenes/garage.js'
import Laurencin from './scenes/laurencin.js'
import SceneManager from './scenes/sceneManager.js'
import Urtillo from './scenes/urtillo.js'
import SCENES from '../Utils/SCENES'
import Home from './scenes/home.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.home = new Home()

        this.sceneManager = new SceneManager()
        console.log(this.sceneManager.getCurrent());
       
      
        this.resources.on('ready', () => {

            this.garage = new Garage()
            this.laurencin = new Laurencin()
            this.urtillo = new Urtillo()
            this.environment = new Environment()
          

        })
    }

    update() {
        
        if (this.fox) {
            this.fox.update()
        }
        if (this.sceneManager.getCurrent() == SCENES.HOME) {
            this.home.update()

        }

        if (this.garage && this.sceneManager.getCurrent() == SCENES.GARAGE) {
            this.garage.update()
        }
        if (this.laurencin && this.sceneManager.getCurrent() == SCENES.LAURENCIN) {
            this.laurencin.update()
        }
        if (this.urtillo && this.sceneManager.getCurrent() == SCENES.URTILLO) {
            this.urtillo.update()
        }

    }
}