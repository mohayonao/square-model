import linlin from "@mohayonao/utils/linlin";
import { SUGAR_INIT } from "../model/config";

export default class Viewer {
  constructor(model) {
    this.model = model;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 240;
    this.canvas.height = 240;
    this.context = this.canvas.getContext("2d");
    this.context.font = "400 12px 'Courier', monospace";
  }

  update() {
    let { model, canvas, context } = this;

    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw grid
    model.grids.forEach((grid, index) => {
      let dx = canvas.width / model.grids.length;
      let dy = 64;
      let x0 = dx * index;
      let y0 = 0;
      let gray = linlin(grid.resource, 0, SUGAR_INIT, 32, 255)|0;
      let str = `${grid.resource}`;
      let mx = context.measureText(str).width * 0.5;
      let fontColor = "#fff";

      context.fillStyle = toColor(gray, gray, gray);
      context.fillRect(x0, y0, dx, dy);

      if (192 <= gray) {
        fontColor = "#000";
      }

      context.fillStyle = fontColor;
      context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
    });

    // draw ants
    model.ants.forEach((ant, index) => {
      let dx = canvas.width / model.grids.length;
      let dy = (canvas.height - 64) / model.ants.length;
      let x0 = dx * ant.position;
      let y0 = dy * index + 64;
      let str = `${ant.pool}`;
      let mx = context.measureText(str).width * 0.5;

      context.fillStyle = "#00ff00";
      context.fillRect(x0, y0, dx, dy);

      context.fillStyle = "#ff00ff";
      context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
    });
  }
}

function toColor(r, g, b) {
  return "#" + [ r, g, b ].map(x => `00${x.toString(16)}`.substr(-2)).join("");
}
