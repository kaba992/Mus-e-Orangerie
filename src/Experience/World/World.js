import Experience from '../Experience.js'
import Environment from './Environment.js'
import AudioHandler from "./AudioHandler";
import Scene from './scenes/Scene.js'
import SCENES from '../Utils/SCENES'
import Map from './scenes/Home/Map.js'
import MouseHandler from "./MouseHandler";
import * as THREE from 'three'
import dataMap from '../Utils/dataMap.json'

export default class World {
    state = "map";
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

        })
    }


    /**
     * Lance le processus de changement de zone et modifie les infos correspondantes
     *
     * @param namePlace
     */
    initSceneState(namePlace){
        const maps = ["montmartre","orangerie"]
        if(maps.includes(namePlace)){
            this.state = "map";
            this[namePlace].start();
        }
        else{
            this.state = namePlace;
            this.scenePoi.initScene(namePlace);
        }

        this.transitionAnimation({maps,namePlace})
    }

    /**
     * Animation de transition GSAP entre les différentes scènes/maps
     *
     * @param params
     */
    transitionAnimation(params){
        this.map.visible = params.maps.includes(params.namePlace);
        this.scenePoi.getMesh().visible = !params.maps.includes(params.namePlace);

        this.handleInfoChanges(params);
    }


    /**
     * Effectue le changement des informations nécessaires
     *
     * @param params
     */
    handleInfoChanges(params){
        const subtitleDOM = document.querySelector(".infos.subTitle");
        const titleDOM = document.querySelector(".infos.title");
        let subtitle = "";
        let title = "";


        if(params.maps.includes(params.namePlace)){
            subtitle = dataMap[params.namePlace].subtitle;
            title = dataMap[params.namePlace].title;
        }
        else{
            subtitle = dataMap.montmartre.poi[params.namePlace].subtitle;
            title =  dataMap.montmartre.poi[params.namePlace].title;
        }

        subtitleDOM.innerHTML = subtitle;
        titleDOM.innerHTML = title;

        if(this.state = "map"){
            document.querySelector("p.leftInfo").classList.remove("hidden")
            document.querySelector("button.leftInfo").classList.add("hidden")
            document.querySelector("button.replayInput").classList.remove("scene")
            document.querySelector(".hubScene").classList.add("hidden")
        }
        else{
            document.querySelector("p.leftInfo").classList.add("hidden")
            document.querySelector("button.leftInfo").classList.remove("hidden")
            document.querySelector("button.replayInput").classList.add("scene")
            document.querySelector(".hubScene").classList.remove("hidden")
        }
    }

    update() {
        if(this.montmartre) this.montmartre.update()
        if(this.audioHandler) this.audioHandler.update();
        if(this.mouseHandler) this.mouseHandler.update();
    }
}