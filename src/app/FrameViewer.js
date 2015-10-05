import linlin from "@mohayonao/utils/linlin";
import range from "@mohayonao/utils/range";

export default class FrameViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.imageData = null;
    this.frameLength = 0;
    this.duration = 0;
  }

  draw(frames, model) {
    let canvas = this.canvas;
    let context = canvas.getContext("2d");

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    this.duration = frames[frames.length - 1].time;
    this.drawFrames(canvas, context, frames, model);

    this.imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    this.frameLength = frames.length;
  }

  revert() {
    if (this.imageData === null) {
      return;
    }
    let canvas = this.canvas;
    let context = canvas.getContext("2d");

    context.putImageData(this.imageData, 0, 0);
  }

  drawFrameSeek(time) {
    let canvas = this.canvas;
    let context = canvas.getContext("2d");
    let y0 = (time / this.duration) * canvas.height;

    context.strokeStyle = "#f00";
    context.beginPath();
    context.moveTo(0, y0);
    context.lineTo(canvas.width, y0);
    context.stroke();
  }

  drawFrames(canvas, context, frames, model) {
    let dy = canvas.height / frames.length;
    let dx = 15;

    frames.forEach(({ time, grids, ants }, i ) => {
      let y0 = (time / this.duration) * canvas.height;

      if (i % 25 === 0) {
        context.fillStyle = "#fff";
        context.fillText(time|0, 2, y0 + 10);
      }

      grids.forEach(({ resource }, j) => {
        let x0 = j * dx;
        let gray = linlin(resource, 0, model.SUGAR_INIT, 224, 0)|0;

        context.fillStyle = toColor(gray, gray, gray);
        context.fillRect(25 + x0, y0, dx, canvas.height - y0);
      });

      let relaySounds = range(grids.length).map(() => 0);

      ants.filter(ant => ant.updated && !ant.mobile).forEach(({ position }) => {
        relaySounds[position] += 1;
      });

      context.fillStyle = "rgba(255, 255, 255, 0.8)";

      relaySounds.forEach((count, position) => {
        let x0 = position * dx;
        let r = count;

        context.beginPath();
        context.arc(175 + x0 + dx * 0.5, y0 + dy * 0.5, r, 0, 2 * Math.PI, false);
        context.fill();
      });

      let mobileCount = ants.filter(ant => ant.mobile).length;
      let r = mobileCount;

      context.fillStyle = "rgba(24, 255, 192, 0.8)";

      context.beginPath();
      context.arc(325 + dx * 0.5, y0 + dy * 0.5, r, 0, 2 * Math.PI, false);
      context.fill();

      if (i % 25 === 0) {
        context.fillStyle = "#fff";
        context.fillText(ants.length, 350, y0 + 10);
      }
      if (i === frames.length - 1) {
        context.fillStyle = "#fff";
        context.fillText(ants.length, 350, y0);
      }
    });
  }
}

function toColor(r, g, b) {
  return "#" + [ r, g, b ].map(x => `00${(x|0).toString(16)}`.substr(-2)).join("");
}
