import getAudioContext from "@mohayonao/web-audio-utils/getAudioContext";
import enableMobileAutoPlay from "@mohayonao/web-audio-utils/enableMobileAutoPlay";
import Model from "./model/Model";
import Application from "./app";
import ModelView from "./app/ModelView";

global.onload = () => {
  let audioContext = getAudioContext();
  let app = new Application(audioContext);

  enableMobileAutoPlay(audioContext);

  let timerId = 0;
  let startTime = 0;
  let vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false,
      elapsed: "",
    },
    methods: {
      soundOn() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          app.start();
          startTime = Date.now();
          timerId = setInterval(() => {
            let elapsed = Date.now() - startTime;
            let msec = elapsed % 1000;
            let seconds = Math.floor(elapsed / 1000) % 60;
            let minutes = Math.floor(elapsed / 1000 / 60);

            this.elapsed = `${minutes}:${seconds}.${msec}`;
          }, 250);
        } else {
          app.stop();
          clearInterval(timerId);
        }
      },
      addMobile() {
        app.addMobile();
      },
      removeMobile() {
        app.removeMobile();
      }
    }
  });
};

export default {};
