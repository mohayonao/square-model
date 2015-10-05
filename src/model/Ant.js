import sample from "@mohayonao/utils/sample";
import { ofRandomInt } from "./of";

export default class Ant {
  constructor(model) {
    this.model = model;

    this.death = false;
    this.take = this.model.TAKE_INIT;
    this.appetite = this.model.APPETITE_INIT;
    this.pool = this.model.POOL_INIT;

    this.position = ofRandomInt(this.model.grids.length - 1);
    this.updated = false;
    this.mobile = false;
  }

  toJSON() {
    return {
      death: this.death,
      take: this.take,
      appetite: this.appetite,
      pool: this.pool,
      position: this.position,
      updated: this.updated,
      mobile: this.mobile
    };
  }

  move() {
    let hungerRate = this.pool / this.model.BORN_LINE_OF_POOL;
    let moveRate = this.model.MOVE_RATE * hungerRate;

    if (!(Math.random() < moveRate)) {
      return;
    }

    if (Math.random() < this.model.MOBILE_RATE) {
      this.mobile = true;
      this.updated = true;
      return;
    }

    let grids = this.model.grids.filter((grid, index) => {
      let minPosition = this.position - this.model.VIEW_WIDTH;
      let maxPosition = this.position + this.model.VIEW_WIDTH;

      return minPosition <= index && index <= maxPosition;
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
