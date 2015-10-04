import range from "@mohayonao/utils/range";
import { GRID_NUM_INIT, ANT_NUM_INIT, BORN_LINE_OF_POOL, DEATH_LINE_OF_POOL } from "./config";
import Grid from "./Grid";
import Ant from "./Ant";

export default class Model {
  constructor() {
    this.grids = range(GRID_NUM_INIT).map((index) => new Grid(this, index));
    this.ants = range(ANT_NUM_INIT).map(() => new Ant(this));
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
      if (ant.pool >= BORN_LINE_OF_POOL) {
        // Decreases it's pool
        ant.pool >>= 1;

        let a = new Ant(this);

        a.pool = ant.pool;
        this.ants.push(a);

        // Notification the born event to square for changing clock time
        // let num = this.ants.length;
        // notice.notify("BORN", num);
      } else if (ant.pool <= DEATH_LINE_OF_POOL) {
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
