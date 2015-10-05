import Timeline from "@mohayonao/timeline";
import WorkerTimer from "worker-timer";
import Model from "../model/Model";
import FrameViewer from "./FrameViewer";
import ModelViewer from "./ModelViewer";
import RelaySound from "./RelaySound";

export default class App {
  constructor(audioContext) {
    let frameCanvas = document.getElementById("frame");

    frameCanvas.width = frameCanvas.clientWidth;
    frameCanvas.height = frameCanvas.clientHeight;
    this.frameViewer = new FrameViewer(frameCanvas);

    this.audioContext = audioContext;
    this.isPlaying = false;
    this.startTime = 0;
    this.timeline = new Timeline({ context: this.audioContext, timerAPI: WorkerTimer });

    this.state = {
      relays: true,
      mobile: true,
      antiQuantize: true,
    };

    this.$onProcess = this.$onProcess.bind(this);
  }

  setState(state) {
    this.state = state;
  }

  setConfig(config) {
    this.config = {
      ITER_COUNT: config.ITER_COUNT,
      SUGAR_INIT: config.SUGAR_INIT,
      SUGAR_RECOVERY_NUM: config.SUGAR_RECOVERY_NUM,
      TAKE_INIT: config.TAKE_INIT,
      APPETITE_INIT: config.APPETITE_INIT,
      BORN_LINE_OF_POOL: config.BORN_LINE_OF_POOL,
      MOVE_RATE: config.MOVE_RATE / 100,
      MOBILE_RATE: config.MOBILE_RATE / 100
    };
    this.model = new Model(this.config);
    this.frames = this.model.build(this.config.ITER_COUNT);
    this.frameViewer.draw(this.frames, this.model);
  }

  start() {
    if (this.isPlaying || !this.frames) {
      return;
    }
    this.isPlaying = true;

    let modelCanvas = document.getElementById("model");

    modelCanvas.width = modelCanvas.clientWidth;
    modelCanvas.height = modelCanvas.clientHeight;
    this.modelViewer = new ModelViewer(modelCanvas);
    this.time = 0;

    this.frameIndex = 0;
    this.timeline.start(this.$onProcess);
  }

  stop() {
    this.isPlaying = false;
  }

  $onProcess({ playbackTime }) {
    let frame = this.frames[this.frameIndex++];

    this.time += 1;

    if (frame) {
      this.modelViewer.draw(this.time, frame, this.model);
      this.frameViewer.revert();
      this.frameViewer.drawFrameSeek(this.frameIndex, this.config);

      frame.ants.filter(ant => ant.updated).forEach((ant) => {
        let t0 = playbackTime;

        if (this.state.antiQuantize) {
          t0 += Math.random() * 1;
        }

        if (ant.mobile && this.state.mobile) {
          let sound = new RelaySound(this.audioContext, ant.position);

          sound.start(t0);
          sound.outlet.connect(this.audioContext.destination);
        }
        if (!ant.mobile && this.state.relays) {
          let sound = new RelaySound(this.audioContext, ant.position);

          sound.start(t0);
          sound.outlet.connect(this.audioContext.destination);
        }
      });
    }

    if (this.frames.length <= this.franeIndex) {
      this.model = new Model(this.config);
      this.frames = this.model.build(this.config.ITER_COUNT);
      this.frameViewer.draw(this.frames, this.model);
      this.frameIndex = 0;
    }

    if (this.isPlaying) {
      let interval = 300 / this.config.ITER_COUNT;

      this.timeline.insert(playbackTime + interval, this.$onProcess);
    }
  }
}
