import Entity from './scenes/Entity';
import { Howl } from 'Howler';
import { WebVTTParser } from 'webvtt-parser';
import gsap from 'gsap';

export default class AudioHandler extends Entity {
    static instance = null;
    subtitle = document.querySelector('.subtitle')
    currentSrc = null;
    webVTTParser
    audioStoped
    static audio = null
    static subtitlesCues = null

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
        this.currentSrc = subtitleFile;
    }

    resetAudio(){
        AudioHandler.audio.stop()
        AudioHandler.audio._duration =0
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
            if (AudioHandler.audio)  {
               console.log("testttttt");
                AudioHandler.audio.play()
                gsap.to(
                    ".bottomHover", {
                    width: "100%",
                    duration: AudioHandler.audio._duration,
                }
                )

            }


            gsap.to(
                ".bottomBar",
                {
                    duration: 1,
                    y: "85%",
                    transformOrigin: "center center",
                    // background: "rgba(0,0,0,1)",
                    ease: "power4.out"
                }
            )

            gsap.to(
                ".lettre-container",
                {
                    bottom: "-100%",
                    duration: 1.5,
                    ease: "power2.out"
                }
            )

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
                    return
                }
                this.subtitle.innerHTML = "";
            }
        } else {
          

        }
    }
}