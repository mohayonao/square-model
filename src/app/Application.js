import appendIfNotExists from "@mohayonao/utils/appendIfNotExists";
import removeIfExists from "@mohayonao/utils/removeIfExists";
import enableMobileAutoPlay from "@mohayonao/web-audio-utils/enableMobileAutoPlay";

enableMobileAutoPlay();

export default class App {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.models = [];
    this.isPlaying = false;
    this.$onProcess = this.$onProcess.bind(this);
  }

  addModel(model) {
    appendIfNotExists(this.models, model);
  }

  removeModel(model) {
    model.dispose();
    removeIfExists(this.models, model);
  }

  start() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    requestAnimationFrame(this.$onProcess);
  }

  stop() {
    this.isPlaying = false;
  }

  $onProcess() {
    this.models.forEach((model) => {
      model.update(this.audioContext.currentTime);
    });

    if (this.isPlaying) {
      requestAnimationFrame(this.$onProcess);
    }
  }
}
