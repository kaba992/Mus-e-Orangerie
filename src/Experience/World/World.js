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
    zoneEncounter = []
    inTrans = false
    prevPlace = ""

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera

        this.resources.on('ready', () => {
            this.environment = new Environment()
            this.audioHandler = new AudioHandler();
            this.mouseHandler = new MouseHandler();
            this.map = new THREE.Group();
            this.map.name = "map"
            this.montmartre = new Map("montmartre");
            this.orangerie = new Map("orangerie");
            this.orangerie.start()
            this.montmartre.start()
            this.map.add(this.montmartre.getMesh());
            this.map.add(this.orangerie.getMesh());
            this.scene.add(this.map)
            this.orangerie.setPosition()
            this.scenePoi = new Scene()
            this.initUI()

        })
    }

    initUI(){
        document.querySelector('.backmap').addEventListener('click',() => {
            this.initSceneState("montmartre")
        })
    }


    /**
     * Lance le processus de changement de zone et modifie les infos correspondantes
     *
     * @param namePlace
     */
    initSceneState(namePlace){
        const maps = ["montmartre","orangerie"]
        let inMap = maps.includes(namePlace)
        if(inMap){
            this.state = "map";
            // console.log("in Map")
        }
        else{
            this.state = namePlace;


        }

        this.transitionAnimation({maps,inMap,namePlace})
    }

    /**
     * Animation de transition GSAP entre les différentes scènes/maps
     *
     * @param params
     */
    transitionAnimation(params){


        const transition = document.querySelector(".transition")
        let anim = gsap.timeline()
        anim
            .from(transition,{
            opacity:0
        })
            .to(transition,{
                opacity:1,
                duration:0.25
            })
            .add(() => {
                if(params.inMap){
                    this.experience.composerEnable = false;
                    if(!this.zoneEncounter.includes(this.prevPlace) ){
                        console.log(this.zoneEncounter.includes(this.prevPlace),this.prevPlace)
                        this.zoneEncounter.push(this.prevPlace)
                        this.montmartre.modifyPoisMaterial(this.prevPlace)
                        this.counter += 1;
                        console.log(this.counter)
                    }

                    if( this.counter == 1){
                        this[params.namePlace].resetPos();
                        this.transitionBtnOrangerie()
                    }else{
                        this[params.namePlace].resetPos();

                    }
                }
                else{
                    this.scenePoi.initScene(params.namePlace);
                    this.experience.composerEnable = true;
                    this.prevPlace = params.namePlace
                }
                this.handleInfoChanges(params);
                this.map.visible = params.maps.includes(params.namePlace);
                this.scenePoi.getMesh().visible = !params.maps.includes(params.namePlace);

            },"<0.5")
            .to(transition,{
                opacity:0,
                duration:1
            })
            .add(() => {
                this.inTrans = false

            })
    }


    /**
     * Effectue le changement des informations nécessaires
     *
     * @param params
     */
    handleInfoChanges(params){
        if(this.state == "map"){
            document.querySelector("p.leftInfo").classList.remove("hidden")
            document.querySelector("button.leftInfo").classList.add("hidden")
            document.querySelector("button.leftInfo").classList.remove("scene")
            document.querySelector("button.replayInput").classList.remove("scene")
            document.querySelector(".hubScene").classList.add("hidden")
        }
        else{
            document.querySelector("p.leftInfo").classList.add("hidden")
            document.querySelector("button.leftInfo").classList.remove("hidden")
            document.querySelector("button.leftInfo").classList.add("scene")
            document.querySelector("button.replayInput").classList.add("scene")
            document.querySelector(".hubScene").classList.remove("hidden")
        }
    }

    transitionTitle(path, back = false){
        let active = document.querySelectorAll('.active');
        let data = null;

        if(this.state == "map" && this.counter <= 3 && path != "montmartre" ){
            data = dataMap.montmartre.poi[path]
        }
        else if((this.state != "map" && this.counter <= 3 && back) || path == "montmartre"){
            data = dataMap.montmartre
        }
        else if((this.state == "map" && this.counter == 4) || path == "orangerie"){
            data = dataMap.orangerie
        }
        else if(this.state == "map" && this.counter == 5){
            data = dataMap.orangerie.poi.museum
        }

        if(path != "montmartre" || path != "orangerie"){
            // console.log("NOT IN ORANGERIE OR MONTMARTRE")
            // this.initSceneState(path)
        }


        if(data && active[0].innerHTML != data.subtitle && active[1].innerHTML != data.title ){
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
    }

    transitionBtnOrangerie(){
        let anim = gsap.timeline()
        anim.to('.mask',{
            bottom:"20%",
        })
            .add(() =>
                document.querySelector('.maskBtn').addEventListener("click",() => {
                   
                    this.transitionOrangerie();
                    let anim2 = gsap.timeline()
                    anim2.to(".mask",{
                        bottom:"-5em",
                    })
                })
            )
    }

    transitionOrangerie(){
        let anim = gsap.timeline()
        anim.add(() => {
            this.orangerie.resetPos();
        })
            .to(this.map.position,{
            x: 40,
            y: 0,
            z: -220,
                duration:5,
                ease: "Power4.easeInOut"
        },"<")
    }

    update() {
        if(this.audioHandler) this.audioHandler.update();
        if(this.mouseHandler) this.mouseHandler.update();
        if(this.scenePoi) this.scenePoi.update()
    }
}