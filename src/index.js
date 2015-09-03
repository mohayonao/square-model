import getAudioContext from "@mohayonao/web-audio-utils/getAudioContext";
import enableMobileAutoPlay from "@mohayonao/web-audio-utils/enableMobileAutoPlay";
import Model from "./model/Model";
import Application from "./app";
import ModelView from "./app/ModelView";

global.onload = () => {
  let audioContext = getAudioContext();
  let app = new Application(audioContext);

  enableMobileAutoPlay(audioContext);

  let vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false
    },
    methods: {
      soundOn() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          app.start();
        } else {
          app.stop();
        }
      },
      addModel() {
        let model = new ModelView(audioContext, new Model());

        model.on("remove", () => {
          this.removeModel(model);
        });

        app.addModel(model);
      },
      removeModel(model) {
        app.removeModel(model);
      }
    }
  });

  vue.addModel();
};

export default {};
