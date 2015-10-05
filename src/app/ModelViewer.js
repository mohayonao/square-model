import linlin from "@mohayonao/utils/linlin";
import rand2 from "@mohayonao/utils/rand2";
import constrain from "@mohayonao/utils/constrain";

export default class ModelViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.real = new Float32Array(9);
    this.imag = new Float32Array(9);
    this.resources = new Uint16Array(9);
  }

  draw(time) {
    let canvas = this.canvas;
    let context = canvas.getContext("2d");
    let msec = Math.floor(time * 1000) % 1000;
    let seconds = Math.floor(time) % 60;
    let minutes = Math.floor(time / 60);

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, 64);

    context.fillStyle = "#fff";
    context.fillText(`${zero2(minutes)}:${zero2(seconds)}.${zero3(msec)}`, 2, 12);

    this.drawGrids(time, canvas, context);
  }

  update({ grids, ants }, model) {
    let canvas = this.canvas;
    let context = canvas.getContext("2d");

    grids.forEach((grid, index) => {
      this.real[index] = (1 - (grid.resource / model.SUGAR_INIT)) * 0.75;
      this.resources[index] = grid.resource;
    });

    this.drawAnts(canvas, context, ants, model);
  }

  bang(position) {
    this.imag[position] = 1;
  }

  drawGrids(time, canvas, context) {
    let dx = canvas.width / this.real.length;
    let dy = 48;
    let r = Math.min(dx, dy) * 0.45;

    for (let i = 0; i < this.real.length; i++) {
      let x0 = i * dx;
      let y0 = 16;
      let diff = (this.real[i] - this.imag[i]) * 0.125
      let str = this.resources[i]|0;
      let mx = context.measureText(str).width * 0.5;
      let fontColor = "#fff";

      this.imag[i] += diff;

      let z = this.imag[i];

      z = constrain(linlin(z, 0, 1, 8, 255) + rand2(8), 0, 255);

      context.fillStyle = toColor(z, z * 0.75, z * 0.1);
      context.beginPath();
      context.arc(x0 + dx * 0.5, y0 + dy * 0.5, r, 0, Math.PI * 2, false);
      context.fill();

      context.fillStyle = fontColor;
      context.fillText(str, x0 + dx * 0.5 - mx, y0 + 26);
    }
  }

  drawAnts(canvas, context, ants, model) {
    context.fillStyle = "#000";
    context.fillRect(0, 64, canvas.width, canvas.height);

    ants.forEach((ant, index) => {
      let dx = canvas.width / model.grids.length;
      let dy = (canvas.height - 64) / ants.length;
      let x0 = dx * ant.position;
      let y0 = dy * index + 64;
      let str = `${ant.pool|0}`;
      let mx = context.measureText(str).width * 0.5;

      if (ant.mobile) {
        context.fillStyle = "#ff6666";
      } else {
        context.fillStyle = "#ffffff";
      }

      context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
    });
  }
}

function toColor(r, g, b) {
  return "#" + [ r, g, b ].map(x => `00${(x|0).toString(16)}`.substr(-2)).join("");
}

function zero2(num) {
  return num < 10 ? "0" + num : num;
}

function zero3(num) {
  return num < 100 ? "00" + num : zero2(num);
}
