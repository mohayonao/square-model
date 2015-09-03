import { SUGAR_INIT, SUGAR_RECOVERY_NUM } from "./config";
import { ofRandomInt } from "./of";

export default class Grid {
  constructor() {
    this.resource = ofRandomInt(SUGAR_INIT + 1);
  }

  decrease(num) {
    this.resource -= num;
    if (this.resource < 0) {
      this.resource = 0;
    }
  }

  recovery() {
    this.resource += SUGAR_RECOVERY_NUM;
    if (this.resource > SUGAR_INIT) {
      this.resource = SUGAR_INIT;
    }
  }
}
