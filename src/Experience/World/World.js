import Experience from '../Experience.js'
import Environment from './Environment.js'
import AudioHandler from "./AudioHandler";
import Scene from './scenes/Scene.js'
import SCENES from '../Utils/SCENES'
import Map from './scenes/Home/Map.js'
import MouseHandler from "./MouseHandler";
import * as THREE from 'three'
import dataMap from '../Utils/dataMap.json'
import gsap from 'gsap'


export default class World {
    state = "map";
    namespace = "montmartre"
    counter = 0;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.environment = new Environment()
            this.audioHandler = new AudioHandler();
            this.mouseHandler = new MouseHandler();
            this.map = new THREE.Group();

            this.map.name = "map"
            this.montmartre = new Map("montmartre");
            this.orangerie = new Map("orangerie");
            this.montmartre.start()
            this.map.add(this.montmartre.getMesh());
            this.map.add(this.orangerie.getMesh());
            this.scene.add(this.map)
            this.orangerie.setPosition()
            this.scenePoi = new Scene()
            // this.scenePoi.initScene('utrillo')
        })
    }

    /**
     * Lance le processus de changement de zone et modifie les infos correspondantes
     *
     * @param namePlace
     */
    initSceneState(namePlace) {
        const maps = ["montmartre", "orangerie"]
        if (maps.includes(namePlace)) {
            this.state = "map";
            this[namePlace].start();
            
        }
        else {
            this.state = namePlace;
            this.scenePoi.initScene(namePlace);
        }

        this.transitionAnimation({ maps, namePlace })
    }

    /**
     * Animation de transition GSAP entre les différentes scènes/maps
     *
     * @param params
     */
    transitionAnimation(params) {
       
        this.map.visible = params.maps.includes(params.namePlace);
        this.scenePoi.model.scene.visible = !params.maps.includes(params.namePlace);
        this.handleInfoChanges(params);
    }


    /**
     * Effectue le changement des informations nécessaires
     *
     * @param params
     */
    handleInfoChanges(params){
        if(this.state = "map"){
            document.querySelector("p.leftInfo").classList.remove("hidden")
            document.querySelector("button.leftInfo").classList.add("hidden")
            document.querySelector("button.replayInput").classList.remove("scene")
            document.querySelector(".hudScene").classList.add("hidden")
        }
        else {
            document.querySelector("p.leftInfo").classList.add("hidden")
            document.querySelector("button.leftInfo").classList.remove("hidden")
            document.querySelector("button.replayInput").classList.add("scene")
            document.querySelector(".hudScene").classList.remove("hidden")
        }
    }

    transitionTitle(path, back = false){
        let active = document.querySelectorAll('.active');
        let data = null;
        console.log(path)
        if(this.state == "map" && this.counter <= 3 && path != "montmartre" ){
            data = dataMap.montmartre.poi[path].scene
        }
        else if((this.state != "map" && this.counter <= 3 && back) || path == "montmartre"){
            data = dataMap.montmartre.poi
        }
        else if((this.state == "map" && this.counter == 4) || path == "orangerie"){
            data = dataMap.orangerie.poi
        }
        else if(this.state == "map" && this.counter == 5){
            data = dataMap.orangerie.poi.museum
        }

        let anim = gsap.timeline()
        anim
            .from(active,{
            y:"0%"
        })
            .to(active[0],{
            y:"-100%"
        })
            .to(active[1],{
                y:"-100%"
            },'<0.1')
            .add(() => {
                active[0].innerHTML = data.subtitle;
                active[1].innerHTML = data.title;

            },"<0.25")
            .from(active,{
                y:"100%"
            },)
            .to(active[0],{
                y:"0%"
            })
            .to(active[1],{
                y:"0%"
            },'<0.1')
    }

    update() {
        if (this.audioHandler) this.audioHandler.update();
        if (this.scenePoi) this.scenePoi.update()
        if (this.mouseHandler) {
            this.mouseHandler.update();
            this.object = this.mouseHandler.getCurrentObject()
          if(this.object && this.state == "map" ){
           
            switch (this.object.name) {
                case "garage":
                    this.initSceneState("garage")         
                    break;
                case "utrillo":
                    this.initSceneState("utrillo")
                    break;
                case "laurencin":
                    this.initSceneState("laurencin")
                    break;
                default:
                    break;
            }
          }

        }
    }
}