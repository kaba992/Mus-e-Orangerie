import Entity from './scenes/Entity';
import { Howl } from 'Howler';
import { WebVTTParser } from 'webvtt-parser';
import gsap from 'gsap';
import Scene from './scenes/Scene';

export default class AudioHandler extends Entity {
    static instance = null;
    subtitle = document.querySelector('.subtitle')
    currentSrc = null;
    webVTTParser
    audioStoped
    static audio = null
    static subtitlesCues = null
    anim

    constructor() {
        super();
        if (AudioHandler.instance)
            return AudioHandler.instance;
        this.webVTTParser = new WebVTTParser()
        AudioHandler.instance = this;


        this.subtitles = null



    }

    setAudio(src, subtitleFile) {
        AudioHandler.audio = new Howl({ src: [src] });
        AudioHandler.audio.on("end", () => {
            gsap.to(
                ".timeline", {
                    width: "0%",
                    duration: 1,
                    ease: "power4.out"
                }
            )
            Scene.finishedOnce = true;
            AudioHandler.audio.stop()
            AudioHandler.audio = null;
            this.subtitle.innerHTML = "";
            this.subtitle.style.backgroundColor = "transparent";


        })
        this.currentSrc = subtitleFile;
    }

    resetAudio(){
        AudioHandler.audio.stop()
        Scene.finishedOnce = false;
        AudioHandler.audio = null;
        // AudioHandler.audio._duration =0
        this.anim.kill();
        this.subtitle.innerHTML = "";
        this.subtitle.style.backgroundColor = "transparent";

        gsap.to(
            '.timeline', {
                width: "100%",
            })

    }

    initInput(input) {
        window.fetch(this.currentSrc)
            .then(response => response.text())
            .then(data => {
                this.subtitles = this.webVTTParser.parse(data);

                AudioHandler.subtitlesCues = this.subtitles.cues;
                console.log(this.subtitles.cues);



            })
            .catch(error => console.log(error));

        input.addEventListener("click", () => {


            window.fetch(this.currentSrc)
                .then(response => response.text())
                .then(data => {
                    const subtitles = this.webVTTParser.parse(data);
                    this.anim = gsap.timeline()
                    AudioHandler.audio.play()
                    AudioHandler.subtitlesCues = subtitles.cues;
                    this.anim .to(".timeline", {
                        width: "0%",
                    })
                        .to(
                        ".timeline", {
                        width: "100%",
                        duration: AudioHandler.audio._duration,
                    })
         
                    gsap.to(
                        ".lettre-container",
                        {
                            bottom: "-100%",
                            duration: 1.5,
                            ease: "power2.out"
                        }
                    )
                    document.querySelector('.bottomBar').classList.add('scene');
                })
                .catch(error => console.log(error));


        })

    }

    update() {

   
        if (AudioHandler.audio && AudioHandler.audio.playing()) {
            AudioHandler.audioPlaying = true
            const time = AudioHandler.audio.seek()

            const cues = AudioHandler.subtitlesCues
            for (let i = 0; i < cues.length; i++) {
                if (time > cues[i].startTime && time < cues[i].endTime) {
                    this.subtitle.innerHTML = cues[i].text;
                    this.subtitle.style.backgroundColor = "var(--mainColor)";
                    return
                }
                this.subtitle.innerHTML = "";
                this.subtitle.style.backgroundColor = "transparent";
            }
        }
        else if (AudioHandler.audio
            && !AudioHandler.audio.playing()
            && !Scene.finishedOnce
            && this.world.state != "map"
            && AudioHandler.audio._duration > 3
        ){
            if(!["oranger","garage"].includes(this.world.state)){
                if(this.anim){
                    this.anim.kill();
                }
                AudioHandler.audio.play()
                this.anim  = gsap.timeline()
                this.anim .to(
                    '.timeline', {
                        width: "0%",
                    })
                    .to(
                        ".timeline", {
                            width: "100%",
                            duration: AudioHandler.audio._duration,
                        }
                        ,'>0.5'
                    )
            }
        }
    }
}