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
import Howler from 'howler';



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
        this.ambiance = new Howler.Howl({
            src: ["sounds/Musique_ambiance_fond.mp3"]
        })
        const exp = document.querySelector(".startExp")
        exp.addEventListener('click', () => {
            console.log(this.ambiance);
            this.ambiance.play()
            this.ambiance.loop()
            this.ambiance.volume(0.08)
        })

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
            this.initWeb()
        })
    }

    initUI() {
        document.querySelector('.backmap').addEventListener('click', () => {
            this.initSceneState("montmartre")
            console.log(this.scenePoi);
            this.scenePoi.objects = []
        })
    }


    /**
     * Lance le processus de changement de zone et modifie les infos correspondantes
     *
     * @param namePlace
     */
    initSceneState(namePlace) {
        const maps = ["montmartre", "orangerie"]
        let inMap = maps.includes(namePlace)
        if (inMap) {
            this.state = "map";
            this.audioHandler.resetAudio()
            gsap.to(
                ".lettre-container",
                {
                    bottom: "-100%",
                    duration: 1,
                    ease: "power2.out"
                }
            )

        }
        else {
            this.state = namePlace;
        }

        this.scenePoi.objects = [];
        this.transitionAnimation({ maps, inMap, namePlace })
    }

    /**
     * Animation de transition GSAP entre les différentes scènes/maps
     *
     * @param params
     */
    transitionAnimation(params) {


        const transition = document.querySelector(".transition")
        let anim = gsap.timeline()
        anim
            .from(transition, {
                opacity: 0
            })
            .to(transition, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.easeOut"
            })
            .add(() => {
                if (params.inMap) {
                    this.experience.composerEnable = false;

                    if (!this.zoneEncounter.includes(this.prevPlace)) {

                        this.zoneEncounter.push(this.prevPlace)
                        this.montmartre.modifyPoisMaterial(this.prevPlace)
                        this.counter += 1;
                    }


                    if (this.counter == 3) {
                        this[params.namePlace].resetPos();
                        this.transitionBtnOrangerie()
                    } else {
                        this[params.namePlace].resetPos();

                    }
                }
                else {
                    this.scenePoi.initScene(params.namePlace);
                    this.experience.composerEnable = true;
                    const newLocal = this;
                    newLocal.prevPlace = params.namePlace


                }
                this.handleInfoChanges(params);
                this.map.visible = params.maps.includes(params.namePlace);
                this.scenePoi.getMesh().visible = !params.maps.includes(params.namePlace);
            }, "<1")
            .to(transition, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.easeIn"
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
    handleInfoChanges(params) {
        let anim = gsap.timeline()
        let isMap = this.state == "map";
        const duration = 0.5

        if (isMap) {
            anim
                .to('.backmap', {
                    opacity: 0,
                    pointerEvents: "none",
                    duration: duration
                })
                .to('button.replayInput', {
                    opacity: 0,
                    pointerEvents: "none",
                    duration: duration
                }, '<')
                .to(".hubScene", {
                    opacity: 0,
                    pointerEvents: "none",
                    duration: duration
                }, '<')
                .add(() => {
                    document.querySelector('p.leftInfo').classList.remove('hidden')
                }, '<')
                .add(() => {
                    document.querySelector('.backmap').classList.add('hidden')
                }, '<')
                .add(() => {
                    document.querySelector('.hubScene').classList.add('hidden')
                }, '<')
                .to('p.leftInfo', {
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: duration
                }, "<")
                .add(() => {
                    document.querySelector('.timeline').classList.remove('scene')
                    document.querySelector('.bottomBar').classList.remove('scene')
                })
                .to(
                    ".annotation",
                    {
                        opacity: 0,
                    }
                )


        }
        else {
            gsap.set(
                ".annotation",
                {
                    opacity: 1,
                },
            )
            anim

                .to('p.leftInfo', {
                    opacity: 0,
                    pointerEvents: "none",
                    duration: duration
                })
                .add(() => {
                    document.querySelector('p.leftInfo').classList.add('hidden')
                }, '<')
                .add(() => {
                    if (this.state != "oranger") document.querySelector('.backmap').classList.remove('hidden')
                }, '<')
                .add(() => {
                    document.querySelector('.hubScene').classList.remove('hidden')
                }, '<')
                .to('button.replayInput', {
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: duration
                })
                .to('.backmap', {
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: duration
                }, '<')
                .to(".hubScene", {
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: duration
                }, '<')
                .add(() => {
                    document.querySelector('.timeline').classList.add('scene')
                    if (this.state != "garage" && this.state != "oranger") {
                        console.log("here", this.state)
                        document.querySelector('.bottomBar').classList.add('scene');

                    }
                })




        }
    }


    initWeb() {
        document.querySelector('.startExp').addEventListener("click", () => {
            console.log("test")
            let anim = gsap.timeline()
            anim.to(".landingPage", {
                opacity: 0
            }).to('.landingPage', {
                display: "none"
            }).add(() => {
                document.querySelector('.content').classList.remove("disabled")
            })
        })
    }

    transitionTitle(path, back = false) {
        let active = document.querySelectorAll('.active');
        let data = null;

        if (this.state == "map" && this.counter <= 3 && path != "montmartre") {
            data = dataMap.montmartre.poi[path]
            if (path == "oranger") {
                data = dataMap.orangerie.poi[path]
            }
        }
        else if ((this.state != "map" && this.counter <= 3 && back) || path == "montmartre") {
            data = dataMap.montmartre
        }


        if (data && active[0].innerHTML != data.subtitle && active[1].innerHTML != data.title) {
            let anim = gsap.timeline()
            anim
                .from(active, {
                    y: "0%"
                })
                .to(active[0], {
                    y: "-100%"
                })
                .to(active[1], {
                    y: "-100%"
                }, '<0.1')
                .add(() => {
                    active[0].innerHTML = data.subtitle;
                    active[1].innerHTML = data.title;

                }, "<0.25")
                .from(active, {
                    y: "100%"
                },)
                .to(active[0], {
                    y: "0%"
                })
                .to(active[1], {
                    y: "0%"
                }, '<0.1')
        }
    }

    transitionBtnOrangerie() {
        let anim = gsap.timeline()

        anim.to('.mask', {
            bottom: "20%",
            duration: 1.25
        })
            .add(() => {
                document.querySelector('.maskBtn').addEventListener("click", () => {
                    this.transitionOrangerie();
                    let anim2 = gsap.timeline()
                    anim2.to(".mask", {
                        bottom: "-10em",
                    })
                })
            })
    }

    transitionOrangerie() {
        let anim = gsap.timeline()
        anim.add(() => {
            this.orangerie.resetPos();
        })
            .to(this.map.position, {
                x: 40,
                y: 0,
                z: -220,
                duration: 5,
                ease: "Power4.easeInOut"
            }, "<")
    }

    update() {
        if (this.audioHandler) this.audioHandler.update();
        if (this.mouseHandler) this.mouseHandler.update();
        if (this.scenePoi) this.scenePoi.update()
    }
}