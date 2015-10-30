import getAudioContext from "@mohayonao/web-audio-utils/getAudioContext";
import enableMobileAutoPlay from "@mohayonao/web-audio-utils/enableMobileAutoPlay";
import Application from "./app";

global.addEventListener("DOMContentLoaded", () => {
  let audioContext = getAudioContext();
  let app = new Application(audioContext);

  enableMobileAutoPlay(audioContext);

  let vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false,
      tabId: "tab1",
      ITER_COUNT: 400,
      INIT_INTERVAL: 4.5,
      DECREASE_INTERVAL: 0.02,
      MIN_INTERVAL: 0.3,
      GRID_NUM_INIT: 9,
      ANT_NUM_INIT: 1,
      SUGAR_INIT: 256,
      SUGAR_RECOVERY_NUM: 7,
      VIEW_WIDTH: 3,
      POOL_INIT: 4,
      TAKE_INIT: 15,
      APPETITE_INIT: 8,
      MOVE_RATE: 0.8,
      MOBILE_RATE: 0.05,
      BORN_LINE_OF_POOL: 400,
      relays: true,
      mobile: true,
      antiQuantize: true,
      url: "",
      json: ""
    },
    methods: {
      updateConfig() {
        let json = this.toJSON();

        app.setConfig(json);

        this.url = location.origin + "/#" + encodeURIComponent(JSON.stringify(json));
        this.json = JSON.stringify(json, null, 2);
      },
      updateState() {
        app.setState({
          relays: this.relays,
          mobile: this.mobile,
          antiQuantize: this.antiQuantize
        });
      },
      changeTab(tabId) {
        this.tabId = tabId;
      },
      toJSON() {
        return {
          ITER_COUNT: this.ITER_COUNT,
          INIT_INTERVAL: this.INIT_INTERVAL,
          DECREASE_INTERVAL: this.DECREASE_INTERVAL,
          MIN_INTERVAL: this.MIN_INTERVAL,
          ANT_NUM_INIT: this.ANT_NUM_INIT,
          SUGAR_INIT: this.SUGAR_INIT,
          SUGAR_RECOVERY_NUM: this.SUGAR_RECOVERY_NUM,
          VIEW_WIDTH: this.VIEW_WIDTH,
          POOL_INIT: this.POOL_INIT,
          TAKE_INIT: this.TAKE_INIT,
          APPETITE_INIT: this.APPETITE_INIT,
          BORN_LINE_OF_POOL: this.BORN_LINE_OF_POOL,
          MOVE_RATE: this.MOVE_RATE,
          MOBILE_RATE: this.MOBILE_RATE
        };
      },
      start() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
          app.start();
        } else {
          app.stop();
        }
      }
    }
  });

  if (location.hash) {
    let hash = decodeURIComponent(location.hash.slice(1));
    let json;

    try {
      json = JSON.parse(hash);
    } catch (e) {
      json = {};
    }

    Object.keys(json).forEach((key) => {
      if (vue.hasOwnProperty(key)) {
        vue[key] = json[key];
      }
    });
  }

  vue.updateConfig();
  vue.updateState();
});
