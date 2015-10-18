import Timeline from "@mohayonao/timeline";
import WorkerTimer from "worker-timer";
import Model from "../model/Model";
import FrameViewer from "./FrameViewer";
import ModelViewer from "./ModelViewer";
import RelaySound from "./RelaySound";
import rand2 from "@mohayonao/utils/rand2";

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
      antiQuantize: true
    };

    this.$onProcess = this.$onProcess.bind(this);
  }

  setState(state) {
    this.state = state;
  }

  setConfig(config) {
    this.config = {
      ITER_COUNT: config.ITER_COUNT,
      ANT_NUM_INIT: config.ANT_NUM_INIT,
      SUGAR_INIT: config.SUGAR_INIT,
      SUGAR_RECOVERY_NUM: config.SUGAR_RECOVERY_NUM,
      VIEW_WIDTH: config.VIEW_WIDTH,
      POOL_INIT: config.POOL_INIT,
      TAKE_INIT: config.TAKE_INIT,
      APPETITE_INIT: config.APPETITE_INIT,
      BORN_LINE_OF_POOL: config.BORN_LINE_OF_POOL,
      MOVE_RATE: config.MOVE_RATE,
      MOBILE_RATE: config.MOBILE_RATE
    };
    this.model = new Model(this.config);
    this.frames = this.model.build(this.config.ITER_COUNT);

    let interval = 5;
    let time = 0;
    let decreaseInterval = 0.05;
    let minInterval = 0.25;

    this.frames.forEach((frame, index) => {
      frame.time = time + rand2(interval * 0.75, () => (Math.random() + Math.random()) / 2);
      frame.index = index;

      time += interval;
      interval = Math.max(interval - decreaseInterval, minInterval);
    });

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

    this.startTime = this.timeline.currentTime + 1;
    this.events = [];

    this.frames.forEach((frame) => {
      let playbackTime = this.startTime + frame.time;

      this.events.push({ playbackTime, frame });
    });

    this.timeline.start(this.$onProcess);
  }

  stop() {
    this.isPlaying = false;
  }

  renewEvents() {
    this.setConfig(this.config);

    this.startTime = this.timeline.currentTime + 1;
    this.events = [];

    this.frames.forEach((frame) => {
      let playbackTime = this.startTime + frame.time;

      this.events.push({ playbackTime, frame });
    });
  }

  $onProcess({ playbackTime }) {
    let time = playbackTime - this.startTime;

    if (0 < time) {
      this.frameViewer.revert();
      this.frameViewer.drawFrameSeek(time);
      this.modelViewer.draw(time);

      while (this.events.length && this.events[0].playbackTime < playbackTime) {
        let frame = this.events.shift().frame;

        this.modelViewer.update(frame, this.model);

        frame.ants.filter(ant => ant.updated).forEach((ant) => {
          let t0 = playbackTime;

          if (this.state.antiQuantize) {
            t0 += Math.random() * 0.5;
          }

          if (ant.mobile) {
            if (this.state.mobile) {
              let sound = new RelaySound(this.audioContext, ant.position);

              sound.start(t0);
              sound.outlet.connect(this.audioContext.destination);
            }
          }
          if (!ant.mobile) {
            this.modelViewer.bang(ant.position);

            if (this.state.relays) {
              let sound = new RelaySound(this.audioContext, ant.position);

              sound.start(t0);
              sound.outlet.connect(this.audioContext.destination);
            }
          }
        });
      }
    }

    if (this.events.length === 0) {
      this.renewEvents();
    }

    if (this.isPlaying) {
      this.timeline.insert(playbackTime + 0.05, this.$onProcess);
    }
  }
}
