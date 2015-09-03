(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var LISTENERS = typeof Symbol !== "undefined" ? Symbol("LISTENERS") : "_@mohayonao/event-emitter:listeners";

function EventEmitter() {
  this[LISTENERS] = {};
}

EventEmitter.prototype.listeners = function(event) {
  if (this[LISTENERS].hasOwnProperty(event)) {
    return this[LISTENERS][event].map(function(listener) {
      return listener.listener || listener;
    }).reverse();
  }

  return [];
};

EventEmitter.prototype.addListener = function(event, listener) {
  if (typeof listener === "function") {
    if (!this[LISTENERS].hasOwnProperty(event)) {
      this[LISTENERS][event] = [ listener ];
    } else {
      this[LISTENERS][event].unshift(listener);
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(event, listener) {
  var _this, func;

  _this = this;

  if (typeof listener === "function") {
    func = function(arg1) {
      _this.removeListener(event, func);
      listener(arg1);
    };

    func.listener = listener;

    this.addListener(event, func);
  }

  return this;
};

EventEmitter.prototype.removeListener = function(event, listener) {
  var listeners, i;

  if (typeof listener === "function" && this[LISTENERS].hasOwnProperty(event)) {
    listeners = this[LISTENERS][event];

    for (i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === listener || listeners[i].listener === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(event) {
  if (typeof event === "undefined") {
    this[LISTENERS] = {};
  } else if (this[LISTENERS].hasOwnProperty(event)) {
    delete this[LISTENERS][event];
  }

  return this;
};

EventEmitter.prototype.emit = function(event, arg1) {
  var listeners, i;

  if (this[LISTENERS].hasOwnProperty(event)) {
    listeners = this[LISTENERS][event];

    for (i = listeners.length - 1; i >= 0; i--) {
      listeners[i](arg1);
    }
  }

  return this;
};

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
module.exports = function(array, target) {
  var index = array.indexOf(target);

  if (index !== -1) {
    return false;
  }

  array.push(target);

  return true;
};

},{}],3:[function(require,module,exports){
module.exports = function(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
};

},{}],4:[function(require,module,exports){
module.exports = function(start, stop, step) {
  var length, result;
  var i;

  if (typeof stop === "undefined") {
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  length = Math.max(Math.ceil((stop - start) / step), 0);
  result = Array(length);

  for (i = 0; i < length; i++) {
    result[i] = start;
    start += step;
  }

  return result;
};

},{}],5:[function(require,module,exports){
module.exports = function(array, target) {
  var index = array.indexOf(target);

  if (index === -1) {
    return false;
  }

  array.splice(index, 1);

  return true;
};

},{}],6:[function(require,module,exports){
(function (global){
var getAudioContext = require("./getAudioContext");

/* eslint-disable no-unused-vars */

module.exports = function(audioContext, callback) {
  var memo = null;

  if (!("ontouchstart" in global)) {
    if (typeof callback === "function") {
      setTimeout(callback, 0);
    }
    return;
  }

  audioContext = audioContext || getAudioContext();

  function choreFunction() {
    var bufSrc = audioContext.createBufferSource();
    var buffer = audioContext.createBuffer(1, 128, audioContext.sampleRate);

    bufSrc.buffer = buffer;
    bufSrc.start(audioContext.currentTime);
    bufSrc.stop(audioContext.currentTime + buffer.duration);
    bufSrc.connect(audioContext.destination);
    bufSrc.onended = function() {
      bufSrc.disconnect();
      memo = null;
      if (typeof callback === "function") {
        callback();
      }
    };
    memo = bufSrc;

    global.removeEventListener("touchstart", choreFunction);
  }

  global.addEventListener("touchstart", choreFunction);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./getAudioContext":7}],7:[function(require,module,exports){
(function (global){
var audioContext = null;

if (typeof global.AudioContext === "undefined" && typeof global.webkitAudioContext !== "undefined") {
  global.AudioContext = global.webkitAudioContext;
}
if (typeof global.OfflineAudioContext === "undefined" && typeof global.webkitOfflineAudioContext !== "undefined") {
  global.OfflineAudioContext = global.webkitOfflineAudioContext;
}

module.exports = function() {
  if (audioContext === null) {
    audioContext = new global.AudioContext();
  }
  return audioContext;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsAppendIfNotExists = require("@mohayonao/utils/appendIfNotExists");

var _mohayonaoUtilsAppendIfNotExists2 = _interopRequireDefault(_mohayonaoUtilsAppendIfNotExists);

var _mohayonaoUtilsRemoveIfExists = require("@mohayonao/utils/removeIfExists");

var _mohayonaoUtilsRemoveIfExists2 = _interopRequireDefault(_mohayonaoUtilsRemoveIfExists);

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay = require("@mohayonao/web-audio-utils/enableMobileAutoPlay");

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay2 = _interopRequireDefault(_mohayonaoWebAudioUtilsEnableMobileAutoPlay);

(0, _mohayonaoWebAudioUtilsEnableMobileAutoPlay2["default"])();

var App = (function () {
  function App(audioContext) {
    _classCallCheck(this, App);

    this.audioContext = audioContext;
    this.models = [];
    this.isPlaying = false;
    this.$onProcess = this.$onProcess.bind(this);
  }

  _createClass(App, [{
    key: "addModel",
    value: function addModel(model) {
      (0, _mohayonaoUtilsAppendIfNotExists2["default"])(this.models, model);
    }
  }, {
    key: "removeModel",
    value: function removeModel(model) {
      model.dispose();
      (0, _mohayonaoUtilsRemoveIfExists2["default"])(this.models, model);
    }
  }, {
    key: "start",
    value: function start() {
      if (this.isPlaying) {
        return;
      }
      this.isPlaying = true;
      requestAnimationFrame(this.$onProcess);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isPlaying = false;
    }
  }, {
    key: "$onProcess",
    value: function $onProcess() {
      var _this = this;

      this.models.forEach(function (model) {
        model.update(_this.audioContext.currentTime);
      });

      if (this.isPlaying) {
        requestAnimationFrame(this.$onProcess);
      }
    }
  }]);

  return App;
})();

exports["default"] = App;
module.exports = exports["default"];

},{"@mohayonao/utils/appendIfNotExists":2,"@mohayonao/utils/removeIfExists":5,"@mohayonao/web-audio-utils/enableMobileAutoPlay":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mohayonaoEventEmitter = require("@mohayonao/event-emitter");

var _mohayonaoEventEmitter2 = _interopRequireDefault(_mohayonaoEventEmitter);

var _mohayonaoUtilsAppendIfNotExists = require("@mohayonao/utils/appendIfNotExists");

var _mohayonaoUtilsAppendIfNotExists2 = _interopRequireDefault(_mohayonaoUtilsAppendIfNotExists);

var _mohayonaoUtilsRemoveIfExists = require("@mohayonao/utils/removeIfExists");

var _mohayonaoUtilsRemoveIfExists2 = _interopRequireDefault(_mohayonaoUtilsRemoveIfExists);

var _Viewer = require("./Viewer");

var _Viewer2 = _interopRequireDefault(_Viewer);

var _RelaySound = require("./RelaySound");

var _RelaySound2 = _interopRequireDefault(_RelaySound);

var _modelConfig = require("../model/config");

var GCGuard = [];

var ModelView = (function (_EventEmitter) {
  _inherits(ModelView, _EventEmitter);

  function ModelView(audioContext, model) {
    var _this = this;

    _classCallCheck(this, ModelView);

    _get(Object.getPrototypeOf(ModelView.prototype), "constructor", this).call(this);

    this.audioContext = audioContext;
    this.tick = 0;
    this.playbackTime = 0;
    this.model = model;
    this.viewer = new _Viewer2["default"](this.model);

    document.getElementById("models").appendChild(this.viewer.canvas);

    this.viewer.canvas.addEventListener("dblclick", function () {
      _this.emit("remove");
    });
  }

  _createClass(ModelView, [{
    key: "dispose",
    value: function dispose() {
      document.getElementById("models").removeChild(this.viewer.canvas);
    }
  }, {
    key: "update",
    value: function update(playbackTime) {
      var _this2 = this;

      this.playbackTime = this.playbackTime || playbackTime;

      this.tick -= playbackTime - this.playbackTime;

      if (this.tick <= 0) {
        this.model.update();
        this.viewer.update();
        this.model.ants.forEach(function (ant) {
          var relay = new _RelaySound2["default"](_this2.audioContext, ant.position);
          var soundPlaybackTime = playbackTime + 0.1 + _this2.tick;

          relay.start(soundPlaybackTime);
          relay.on("ended", function () {
            relay.outlet.disconnect();
            relay.dispose();
            (0, _mohayonaoUtilsRemoveIfExists2["default"])(GCGuard, relay);
          });
          (0, _mohayonaoUtilsAppendIfNotExists2["default"])(GCGuard, relay);

          relay.outlet.connect(_this2.audioContext.destination);
        });
        this.tick += _modelConfig.CLOCK_INTERVAL;
      }

      this.playbackTime = playbackTime;
    }
  }]);

  return ModelView;
})(_mohayonaoEventEmitter2["default"]);

exports["default"] = ModelView;
module.exports = exports["default"];

},{"../model/config":17,"./RelaySound":10,"./Viewer":11,"@mohayonao/event-emitter":1,"@mohayonao/utils/appendIfNotExists":2,"@mohayonao/utils/removeIfExists":5}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mohayonaoEventEmitter = require("@mohayonao/event-emitter");

var _mohayonaoEventEmitter2 = _interopRequireDefault(_mohayonaoEventEmitter);

var _sounds = require("./sounds");

var _sounds2 = _interopRequireDefault(_sounds);

var RelaySound = (function (_EventEmitter) {
  _inherits(RelaySound, _EventEmitter);

  function RelaySound(audioContext, position) {
    _classCallCheck(this, RelaySound);

    _get(Object.getPrototypeOf(RelaySound.prototype), "constructor", this).call(this);

    this.audioContext = audioContext;
    this.position = position;

    this.bufSrc = this.audioContext.createBufferSource();
    this.outlet = this.bufSrc;
  }

  _createClass(RelaySound, [{
    key: "start",
    value: function start(playbackTime) {
      var _this = this;

      var buffer = _sounds2["default"].get(this.position);

      if (buffer) {
        this.bufSrc.buffer = buffer;
      }

      this.bufSrc.onended = function () {
        _this.emit("ended");
      };

      this.bufSrc.start(playbackTime);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.bufSrc = null;
    }
  }]);

  return RelaySound;
})(_mohayonaoEventEmitter2["default"]);

exports["default"] = RelaySound;
module.exports = exports["default"];

},{"./sounds":13,"@mohayonao/event-emitter":1}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsLinlin = require("@mohayonao/utils/linlin");

var _mohayonaoUtilsLinlin2 = _interopRequireDefault(_mohayonaoUtilsLinlin);

var _modelConfig = require("../model/config");

var Viewer = (function () {
  function Viewer(model) {
    _classCallCheck(this, Viewer);

    this.model = model;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 240;
    this.canvas.height = 240;
    this.context = this.canvas.getContext("2d");
    this.context.font = "400 12px 'Courier', monospace";
  }

  _createClass(Viewer, [{
    key: "update",
    value: function update() {
      var model = this.model;
      var canvas = this.canvas;
      var context = this.context;

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // draw grid
      model.grids.forEach(function (grid, index) {
        var dx = canvas.width / model.grids.length;
        var dy = 64;
        var x0 = dx * index;
        var y0 = 0;
        var gray = (0, _mohayonaoUtilsLinlin2["default"])(grid.resource, 0, _modelConfig.SUGAR_INIT, 32, 255) | 0;
        var str = "" + grid.resource;
        var mx = context.measureText(str).width * 0.5;
        var fontColor = "#fff";

        context.fillStyle = toColor(gray, gray, gray);
        context.fillRect(x0, y0, dx, dy);

        if (192 <= gray) {
          fontColor = "#000";
        }

        context.fillStyle = fontColor;
        context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
      });

      // draw ants
      model.ants.forEach(function (ant, index) {
        var dx = canvas.width / model.grids.length;
        var dy = (canvas.height - 64) / model.ants.length;
        var x0 = dx * ant.position;
        var y0 = dy * index + 64;
        var str = "" + ant.pool;
        var mx = context.measureText(str).width * 0.5;

        context.fillStyle = "#00ff00";
        context.fillRect(x0, y0, dx, dy);

        context.fillStyle = "#ff00ff";
        context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
      });
    }
  }]);

  return Viewer;
})();

exports["default"] = Viewer;

function toColor(r, g, b) {
  return "#" + [r, g, b].map(function (x) {
    return ("00" + x.toString(16)).substr(-2);
  }).join("");
}
module.exports = exports["default"];

},{"../model/config":17,"@mohayonao/utils/linlin":3}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Application = require("./Application");

var _Application2 = _interopRequireDefault(_Application);

exports["default"] = _Application2["default"];
module.exports = exports["default"];

},{"./Application":8}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mohayonaoWebAudioUtilsGetAudioContext = require("@mohayonao/web-audio-utils/getAudioContext");

var _mohayonaoWebAudioUtilsGetAudioContext2 = _interopRequireDefault(_mohayonaoWebAudioUtilsGetAudioContext);

function fetch(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      resolve({
        text: function text() {
          return xhr.response;
        },
        arrayBuffer: function arrayBuffer() {
          return xhr.response;
        }
      });
    };

    xhr.onerror = reject;
    xhr.send();
  });
}

var sounds = [];

["01.wav", "02.wav", "03.wav", "04.wav", "05.wav", "06.wav", "07.wav", "08.wav", "09.wav"].forEach(function (filename, index) {
  fetch("./sounds/" + filename).then(function (res) {
    return res.arrayBuffer();
  }).then(function (arrayBuffer) {
    return new Promise(function (resolve, reject) {
      (0, _mohayonaoWebAudioUtilsGetAudioContext2["default"])().decodeAudioData(arrayBuffer, resolve, reject);
    });
  }).then(function (audioBuffer) {
    sounds[index] = audioBuffer;
  });
});

exports["default"] = {
  get: function get(index) {
    return sounds[index] || null;
  }
};
module.exports = exports["default"];

},{"@mohayonao/web-audio-utils/getAudioContext":7}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _of = require("./of");

var _config = require("./config");

var LEFT = -1,
    RIGHT = 1;

var Ant = (function () {
  function Ant(m) {
    _classCallCheck(this, Ant);

    this.death = false;
    this.view = _config.VIEW_INIT;
    this.take = _config.TAKE_INIT;
    this.appetite = _config.APPETITE_INIT;
    this.pool = _config.POOL_INIT;

    this.model = m;
    this.position = (0, _of.ofRandomInt)(this.model.grids.length - 1);
  }

  //C Functions

  _createClass(Ant, [{
    key: "move",
    value: function move() {
      var left_grid = edgeCheck(this.position - 1, this.model.grids.length);
      var right_grid = edgeCheck(this.position + 1, this.model.grids.length);

      // Avoid now position by edgeLimitter
      if (left_grid === this.position) {
        this.moveWithDirection(RIGHT);
        return;
      }

      if (right_grid === this.position) {
        this.moveWithDirection(LEFT);
        return;
      }

      var left = this.model.grids[left_grid];
      var right = this.model.grids[right_grid];

      if (left.resource > right.resource) {
        this.moveWithDirection(LEFT);
      } else if (left.resource < right.resource) {
        this.moveWithDirection(RIGHT);
      } else {
        // If left and right is same
        // REVIEW: 2 ??
        var dice = (0, _of.ofRandomInt)(2);

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
  }, {
    key: "moveWithDirection",
    value: function moveWithDirection(d) {
      if (d === LEFT) {
        this.position--;
      }
      if (d === RIGHT) {
        this.position++;
      }
      this.position = edgeCheck(this.position, this.model.grids.length);
    }
  }, {
    key: "eat",
    value: function eat() {
      if (this.model.grids[this.position].resource >= this.take) {
        this.pool += this.take;
      } else {
        this.pool += this.model.grids[this.position].resource;
      }
      this.model.grids[this.position].decrease(this.take);

      this.pool -= this.appetite;
    }
  }]);

  return Ant;
})();

exports["default"] = Ant;
function edgeCheck(position, grid_num) {
  var posi = position;

  if (position >= grid_num) {
    posi = grid_num - 1;
  } else if (position < 0) {
    posi = 0;
  }

  return posi;
}
module.exports = exports["default"];

},{"./config":17,"./of":18}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = require("./config");

var _of = require("./of");

var Grid = (function () {
  function Grid() {
    _classCallCheck(this, Grid);

    this.resource = (0, _of.ofRandomInt)(_config.SUGAR_INIT + 1);
  }

  _createClass(Grid, [{
    key: "decrease",
    value: function decrease(num) {
      this.resource -= num;
      if (this.resource < 0) {
        this.resource = 0;
      }
    }
  }, {
    key: "recovery",
    value: function recovery() {
      this.resource += _config.SUGAR_RECOVERY_NUM;
      if (this.resource > _config.SUGAR_INIT) {
        this.resource = _config.SUGAR_INIT;
      }
    }
  }]);

  return Grid;
})();

exports["default"] = Grid;
module.exports = exports["default"];

},{"./config":17,"./of":18}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsRange = require("@mohayonao/utils/range");

var _mohayonaoUtilsRange2 = _interopRequireDefault(_mohayonaoUtilsRange);

var _config = require("./config");

var _Grid = require("./Grid");

var _Grid2 = _interopRequireDefault(_Grid);

var _Ant = require("./Ant");

var _Ant2 = _interopRequireDefault(_Ant);

var Model = (function () {
  function Model() {
    var _this = this;

    _classCallCheck(this, Model);

    this.grids = (0, _mohayonaoUtilsRange2["default"])(_config.GRID_NUM_INIT).map(function () {
      return new _Grid2["default"]();
    });
    this.ants = (0, _mohayonaoUtilsRange2["default"])(_config.ANT_NUM_INIT).map(function () {
      return new _Ant2["default"](_this);
    });
  }

  _createClass(Model, [{
    key: "update",
    value: function update() {
      this.behaveAnts();
      this.gridsRecovery();
      this.bornAndDeath();
    }
  }, {
    key: "behaveAnts",
    value: function behaveAnts() {
      this.ants.forEach(function (ant) {
        ant.move();
        ant.eat();
      });
    }
  }, {
    key: "gridsRecovery",
    value: function gridsRecovery() {
      this.grids.forEach(function (grid) {
        grid.recovery();
      });
    }
  }, {
    key: "bornAndDeath",
    value: function bornAndDeath() {
      var _this2 = this;

      this.ants.forEach(function (ant) {
        if (ant.pool >= _config.BORN_LINE_OF_POOL) {
          // Decreases it's pool
          ant.pool >>= 1; // * 0.5

          var a = new _Ant2["default"](_this2);

          a.pool = ant.pool;
          _this2.ants.push(a);

          // Notification the born event to square for changing clock time
          // let num = this.ants.length;
          // notice.notify("BORN", num);
        } else if (ant.pool <= _config.DEARH_LINE_OF_POOL) {
            ant.death = true;
          }
      });

      // Remove flg agents
      this.ants = this.ants.filter(function (ant) {
        return !ant.death;
      });
    }
  }]);

  return Model;
})();

exports["default"] = Model;
module.exports = exports["default"];

},{"./Ant":14,"./Grid":15,"./config":17,"@mohayonao/utils/range":4}],17:[function(require,module,exports){
// System
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CLOCK_INTERVAL = 0.5;
var CLOCK_INCREASING_FIX = 1.8;
var GRID_NUM_INIT = 8;
var ANT_NUM_INIT = 1;

// GRID Richness
var SUGAR_INIT = 10;
var SUGAR_RECOVERY_NUM = 2;

// ANT PARAM
var VIEW_INIT = 1;
var POOL_INIT = 4;
var TAKE_INIT = 8;
var APPETITE_INIT = 4;

// Dead or Arrive
var BORN_LINE_OF_POOL = POOL_INIT * 100;
var DEARH_LINE_OF_POOL = 0;

exports["default"] = {
  CLOCK_INTERVAL: CLOCK_INTERVAL,
  CLOCK_INCREASING_FIX: CLOCK_INCREASING_FIX,
  GRID_NUM_INIT: GRID_NUM_INIT,
  ANT_NUM_INIT: ANT_NUM_INIT,
  SUGAR_INIT: SUGAR_INIT,
  SUGAR_RECOVERY_NUM: SUGAR_RECOVERY_NUM,
  VIEW_INIT: VIEW_INIT,
  POOL_INIT: POOL_INIT,
  TAKE_INIT: TAKE_INIT,
  APPETITE_INIT: APPETITE_INIT,
  BORN_LINE_OF_POOL: BORN_LINE_OF_POOL,
  DEARH_LINE_OF_POOL: DEARH_LINE_OF_POOL
};
module.exports = exports["default"];

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ofRandomInt = ofRandomInt;

function ofRandomInt(num) {
  return Math.random() * (num + 1) | 0;
}

},{}],19:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mohayonaoWebAudioUtilsGetAudioContext = require("@mohayonao/web-audio-utils/getAudioContext");

var _mohayonaoWebAudioUtilsGetAudioContext2 = _interopRequireDefault(_mohayonaoWebAudioUtilsGetAudioContext);

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay = require("@mohayonao/web-audio-utils/enableMobileAutoPlay");

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay2 = _interopRequireDefault(_mohayonaoWebAudioUtilsEnableMobileAutoPlay);

var _modelModel = require("./model/Model");

var _modelModel2 = _interopRequireDefault(_modelModel);

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

var _appModelView = require("./app/ModelView");

var _appModelView2 = _interopRequireDefault(_appModelView);

global.onload = function () {
  var audioContext = (0, _mohayonaoWebAudioUtilsGetAudioContext2["default"])();
  var app = new _app2["default"](audioContext);

  (0, _mohayonaoWebAudioUtilsEnableMobileAutoPlay2["default"])(audioContext);

  var vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false
    },
    methods: {
      soundOn: function soundOn() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          app.start();
        } else {
          app.stop();
        }
      },
      addModel: function addModel() {
        var _this = this;

        var model = new _appModelView2["default"](audioContext, new _modelModel2["default"]());

        model.on("remove", function () {
          _this.removeModel(model);
        });

        app.addModel(model);
      },
      removeModel: function removeModel(model) {
        app.removeModel(model);
      }
    }
  });

  vue.addModel();
};

exports["default"] = {};
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":12,"./app/ModelView":9,"./model/Model":16,"@mohayonao/web-audio-utils/enableMobileAutoPlay":6,"@mohayonao/web-audio-utils/getAudioContext":7}]},{},[19]);
