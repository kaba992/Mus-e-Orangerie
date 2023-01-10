import Entity from './scenes/Entity';
import { Howl } from 'Howler';
import { WebVTTParser } from 'webvtt-parser';

export default class AudioHandler extends Entity{
    static instance = null;
    subtitle = document.querySelector('.subtitle')
    currentSrc = null;
    webVTTParser

    constructor() {
        super();
        if(AudioHandler.instance)
            return AudioHandler.instance;
        this.webVTTParser = new WebVTTParser()
    }

    setAudio(src){
        this.audio = new Howl({ src: [src] });
        this.currentSrc = src;
    }

    initInput(input){
        input.addEventListener("click",() => {
            window.fetch(this.currentSrc)
                .then(response => response.text())
                .then(data => {
                    const subtitles = this.webVTTParser.parse(data);
                    this.subtitlesCues = subtitles.cues;
                    this.audio.play()
                })
                .catch(error => console.log(error));

        })
    }

    update(){
        if(this.audio && this.audio.playing()){
            const time = this.audio.seek()
            const cues = this.subtitlesCues
            for (let i = 0; i < cues.length; i++) {
                // console.log(cues[i].text);

                if (time > cues[i].startTime && time < cues[i].endTime) {
                    this.subtitle.innerHTML = cues[i].text;
                    return
                }
                this.subtitle.innerHTML = "";
            }
        }
    }
}