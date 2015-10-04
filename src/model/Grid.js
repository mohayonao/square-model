import { SUGAR_INIT, SUGAR_RECOVERY_NUM } from "./config";
import { ofRandomInt } from "./of";

export default class Grid {
  constructor(model, index) {
    this.model = model;
    this.index = index;
    this.resource = ofRandomInt(SUGAR_INIT + 1);
  }

  decrease(num) {
    this.resource = Math.max(0, this.resource - num);
  }

  recovery() {
    this.resource = Math.min(this.resource + SUGAR_RECOVERY_NUM, SUGAR_INIT);
  }
}
