import { ofRandomInt } from "./of";
import { VIEW_INIT, TAKE_INIT, APPETITE_INIT, POOL_INIT } from "./config";

const LEFT = -1, RIGHT = 1;

export default class Ant {
  constructor(m) {
    this.death = false;
    this.view = VIEW_INIT;
    this.take = TAKE_INIT;
    this.appetite = APPETITE_INIT;
    this.pool = POOL_INIT;

    this.model = m;
    this.position = ofRandomInt(this.model.grids.length - 1);
  }

  move() {
    let left_grid = edgeCheck(this.position - 1, this.model.grids.length);
    let right_grid = edgeCheck(this.position + 1, this.model.grids.length);

    // Avoid now position by edgeLimitter
    if (left_grid === this.position) {
      this.moveWithDirection(RIGHT);
      return;
    }

    if (right_grid === this.position) {
      this.moveWithDirection(LEFT);
      return;
    }

    let left = this.model.grids[left_grid];
    let right = this.model.grids[right_grid];

    if (left.resource > right.resource) {
      this.moveWithDirection(LEFT);
    } else if (left.resource < right.resource) {
      this.moveWithDirection(RIGHT);
    } else {
      // If left and right is same
      // REVIEW: 2 ??
      let dice = ofRandomInt(2);

      if (dice) {
        this.moveWithDirection(LEFT);
      } else {
        this.moveWithDirection(RIGHT);
      }
    }

    // Move Limitter
    // REVIEW: why 2 times call??
    this.position = edgeCheck(this.position, this.model.grids.length);
  }

  moveWithDirection(d) {
    if (d === LEFT) {
      this.position--;
    }
    if (d === RIGHT) {
      this.position++;
    }
    this.position = edgeCheck(this.position, this.model.grids.length);
  }

  eat() {
    if (this.model.grids[this.position].resource >= this.take) {
      this.pool += this.take;
    } else {
      this.pool += this.model.grids[this.position].resource;
    }
    this.model.grids[this.position].decrease(this.take);

    this.pool -= this.appetite;
  }
}

//C Functions
function edgeCheck(position, grid_num) {
  let posi = position;

  if (position >= grid_num) {
    posi = grid_num - 1;
  } else if (position < 0) {
    posi = 0;
  }

  return posi;
}
