import range from "@mohayonao/utils/range";
import defaults from "@mohayonao/utils/defaults";
import Grid from "./Grid";
import Ant from "./Ant";

export default class Model {
  constructor(params) {
    this.GRID_NUM_INIT = defaults(params.GRID_NUM_INIT, 9);
    this.ANT_NUM_INIT = defaults(params.ANT_NUM_INIT, 1);
    this.SUGAR_INIT = defaults(params.SUGAR_INIT, 256);
    this.SUGAR_RECOVERY_NUM = defaults(params.SUGAR_RECOVERY_NUM, 4);
    this.VIEW_WIDTH = defaults(params.VIEW_WIDTH, 2);
    this.POOL_INIT = defaults(params.POOL_INIT, 2);
    this.TAKE_INIT = defaults(params.TAKE_INIT, 6);
    this.APPETITE_INIT = defaults(params.APPETITE_INIT, 1);
    this.MOVE_RATE = defaults(params.MOVE_RATE, 0.7);
    this.MOBILE_RATE = defaults(params.MOBILE_RATE, 0.2);
    this.BORN_LINE_OF_POOL = defaults(params.BORN_LINE_OF_POOL, this.POOL_INIT * 100);
    this.DEATH_LINE_OF_POOL = defaults(params.DEATH_LINE_OF_POOL, 0);
    this.reset();
  }

  reset() {
    this.grids = range(this.GRID_NUM_INIT).map((index) => new Grid(this, index));
    this.ants = range(this.ANT_NUM_INIT).map(() => new Ant(this));
  }

  build(numOfFrames) {
    return range(numOfFrames).map(() => {
      this.update();

      let grids = this.grids.map(grid => grid.toJSON());
      let ants = this.ants.map(ant => ant.toJSON());

      return { grids, ants };
    });
  }

  update() {
    this.gridsRecovery();
    this.behaveAnts();
    this.bornAndDeath();
  }

  behaveAnts() {
    this.ants.forEach((ant) => {
      ant.updated = false;
      ant.mobile = false;
      ant.move();
      ant.eat();
    });
  }

  gridsRecovery() {
    this.grids.forEach((grid) => {
      grid.recovery();
    });
  }

  bornAndDeath() {
    this.ants.forEach((ant) => {
      if (ant.pool >= this.BORN_LINE_OF_POOL) {
        // Decreases it's pool
        ant.pool >>= 1;

        let a = new Ant(this);

        a.pool = ant.pool;
        this.ants.push(a);

        // Notification the born event to square for changing clock time
        // let num = this.ants.length;
        // notice.notify("BORN", num);
      } else if (ant.pool <= this.DEATH_LINE_OF_POOL) {
        ant.death = true;
      }
    });

    // Remove flg agents
    this.ants = this.ants.filter(ant => !ant.death);

    if (this.ants.length === 0) {
      this.ants.push(new Ant(this));
    }
  }
}
