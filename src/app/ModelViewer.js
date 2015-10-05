import linlin from "@mohayonao/utils/linlin";

export default class ModelViewer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  draw(time, { grids, ants }, model) {
    let canvas = this.canvas;
    let context = canvas.getContext("2d");
    let msec = Math.floor(time * 1000) % 1000;
    let seconds = Math.floor(time) % 60;
    let minutes = Math.floor(time / 60);

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.fillText(`${zero2(minutes)}:${zero2(seconds)}.${zero3(msec)}`, 2, 12);

    this.drawGrids(canvas, context, grids, model);
    this.drawAnts(canvas, context, ants, model);
  }

  drawGrids(canvas, context, grids, model) {
    grids.forEach((grid, index) => {
      let dx = canvas.width / grids.length;
      let dy = 48;
      let x0 = dx * index;
      let y0 = 16;
      let gray = linlin(grid.resource, 0, model.SUGAR_INIT, 224, 0)|0;
      let str = `${grid.resource|0}`;
      let mx = context.measureText(str).width * 0.5;
      let fontColor = "#000";

      context.fillStyle = toColor(gray, gray * 0.75, gray * 0.1);
      context.fillRect(x0, y0, dx, dy);

      if (gray < 192) {
        fontColor = "#fff";
      }

      context.fillStyle = fontColor;
      context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
    });
  }

  drawAnts(canvas, context, ants, model) {
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
