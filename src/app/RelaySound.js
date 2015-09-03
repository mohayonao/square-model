import EventEmitter from "@mohayonao/event-emitter";
import sounds from "./sounds";

export default class RelaySound extends EventEmitter {
  constructor(audioContext, position) {
    super();

    this.audioContext = audioContext;
    this.position = position;

    this.bufSrc = this.audioContext.createBufferSource();
    this.outlet = this.bufSrc;
  }

  start(playbackTime) {
    let buffer = sounds.get(this.position);

    if (buffer) {
      this.bufSrc.buffer = buffer;
    }

    this.bufSrc.onended = () => {
      this.emit("ended");
    };

    this.bufSrc.start(playbackTime);

  }

  dispose() {
    this.bufSrc = null;
  }
}
