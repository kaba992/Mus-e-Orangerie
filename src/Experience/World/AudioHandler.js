import Entity from './scenes/Entity';
import { Howl } from 'Howler';
import { WebVTTParser } from 'webvtt-parser';
import gsap from 'gsap';

export default class AudioHandler extends Entity {
    static instance = null;
    subtitle = document.querySelector('.subtitle')
    currentSrc = null;
    webVTTParser
    static audio = null
    static subtitlesCues = null

    constructor() {
        super();
        if (AudioHandler.instance)
            return AudioHandler.instance;
        this.webVTTParser = new WebVTTParser()
        AudioHandler.instance = this;

    }

    setAudio(src, subtitleFile) {
        AudioHandler.audio = new Howl({ src: [src] });
        this.currentSrc = subtitleFile;
    }

    initInput(input) {

        input.addEventListener("click", () => {
            window.fetch(this.currentSrc)
                .then(response => response.text())
                .then(data => {
                    const subtitles = this.webVTTParser.parse(data);
                    AudioHandler.subtitlesCues = subtitles.cues;
                    AudioHandler.audio.play()

                    gsap.to(
                        ".timeline", {
                        width: "100%",
                        duration: AudioHandler.audio._duration,
                    }
                    )
                    // gsap.to(
                    //     ".bottomBar",
                    //     {
                    //         duration: 1,
                    //         y: "85%",
                    //         transformOrigin: "center center",
                    //         // background: "rgba(0,0,0,1)",
                    //         ease: "power4.out"
                    //     }
                    // )

                    gsap.to(
                        ".lettre-container",
                        {
                            bottom: "-100%",
                            duration: 1.5,
                            ease: "power2.out"
                        }
                    )
                })
                .catch(error => console.log(error));

        })

    }

    update() {

        if (AudioHandler.audio && AudioHandler.audio.playing()) {
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
            if(document.querySelector('.soundAnim')){
                gsap.set(
                    ".soundAnim",
                    {
                        width: "0%",

                    }
                )
            }

        }
    }
}