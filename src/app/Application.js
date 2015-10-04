import appendIfNotExists from "@mohayonao/utils/appendIfNotExists";
import removeIfExists from "@mohayonao/utils/removeIfExists";
import sample from "@mohayonao/utils/sample";
import Timeline from "@mohayonao/timeline";
import WorkerTimer from "worker-timer";
import { RESET_INTERVAL, CLOCK_INTERVAL } from "../model/config";
import ModelView from "./ModelView";
import Model from "../model/Model";

export default class App {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.modelView = new ModelView(this.audioContext, null);
    this.isPlaying = false;
    this.startTime = 0;
    this.timeline = new Timeline({ context: this.audioContext, timerAPI: WorkerTimer });
    this.$onProcess = this.$onProcess.bind(this);
  }

  addMobile() {
  }

  removeMobile() {
  }

  start() {
    if (this.isPlaying) {
      return;
    }
    this.modelView.model = new Model();
    this.isPlaying = true;
    this.startTime = Date.now();
    this.timeline.start(this.$onProcess);
  }

  stop() {
    this.isPlaying = false;
  }

  $onProcess({ playbackTime }) {
    let elapsed = (Date.now() - this.startTime) * 0.001;

    if (RESET_INTERVAL <= elapsed) {
      this.modelView.model = new Model();
      this.startTime = Date.now();
      console.log("reset");
    }

    this.modelView.update(this.audioContext.currentTime);

    if (this.isPlaying) {
      this.timeline.insert(playbackTime + CLOCK_INTERVAL, this.$onProcess);
    }
  }
}
