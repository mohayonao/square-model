import { ofRandomInt } from "./of";

export default class Grid {
  constructor(model, index) {
    this.model = model;
    this.index = index;
    this.resource = ofRandomInt(this.model.SUGAR_INIT + 1);
  }

  toJSON() {
    return {
      index: this.index,
      resource: this.resource
    };
  }

  decrease(num) {
    this.resource = Math.max(0, this.resource - num);
  }

  recovery() {
    this.resource = Math.min(this.resource + this.model.SUGAR_RECOVERY_NUM, this.model.SUGAR_INIT);
  }
}
