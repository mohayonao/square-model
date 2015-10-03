import sample from "@mohayonao/utils/sample";
import { ofRandomInt } from "./of";
import { VIEW_WIDTH, VIEW_INIT, TAKE_INIT, APPETITE_INIT, POOL_INIT, MOVE_RATE } from "./config";

export default class Ant {
  constructor(model) {
    this.death = false;
    this.view = VIEW_INIT;
    this.take = TAKE_INIT;
    this.appetite = APPETITE_INIT;
    this.pool = POOL_INIT;

    this.model = model;
    this.position = ofRandomInt(this.model.grids.length - 1);
    this.updated = false;
  }

  move() {
    if (!(Math.random() < MOVE_RATE)) {
      return;
    }

    let grids = this.model.grids.filter((grid) => {
      let minPosition = this.position - VIEW_WIDTH;
      let maxPosition = this.position + VIEW_WIDTH;

      return minPosition <= grid.index && grid.index <= maxPosition;
    });
    let maxResource = grids.reduce((maxValue, grid) => Math.max(maxValue, grid.resource), 0);
    let candidates = grids.filter(grid => grid.resource === maxResource);

    if (candidates.length) {
      let position = sample(candidates).index;

      if (position !== this.position) {
        this.position = position;
        this.updated = true;
      }
    }
  }

  eat() {
    let take = Math.min(this.model.grids[this.position].resource, this.take);

    this.pool += take;
    this.pool -= this.appetite;

    this.model.grids[this.position].decrease(take);
  }
}
