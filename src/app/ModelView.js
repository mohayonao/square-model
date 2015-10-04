import EventEmitter from "@mohayonao/event-emitter";
import appendIfNotExists from "@mohayonao/utils/appendIfNotExists";
import removeIfExists from "@mohayonao/utils/removeIfExists";
import Viewer from "./Viewer";
import RelaySound from "./RelaySound";
import { CLOCK_INTERVAL } from "../model/config";

const GCGuard = [];

export default class ModelView extends EventEmitter {
  constructor(audioContext, model) {
    super();

    this.audioContext = audioContext;
    this.tick = 0;
    this.playbackTime = 0;
    this.model = model;
    this.viewer = new Viewer(this);

    document.getElementById("models").appendChild(this.viewer.canvas);

    this.viewer.canvas.addEventListener("dblclick", () => {
      this.emit("remove");
    });
  }

  dispose() {
    document.getElementById("models").removeChild(this.viewer.canvas);
  }

  update(playbackTime) {
    let phaseTime = CLOCK_INTERVAL / this.model.ants.length;

    this.model.update();
    this.viewer.update();
    this.model.ants.forEach((ant, index) => {
      if (ant.updated && !ant.mobile) {
        let grid = this.model.grids[ant.position];
        let relay = new RelaySound(this.audioContext, grid.index);
        let soundPlaybackTime = playbackTime;

        soundPlaybackTime += phaseTime * index;

        relay.start(soundPlaybackTime);
        relay.on("ended", () => {
          relay.outlet.disconnect();
          relay.dispose();
          removeIfExists(GCGuard, relay);
        });
        appendIfNotExists(GCGuard, relay);

        relay.outlet.connect(this.audioContext.destination);
      }
    });
  }
}
