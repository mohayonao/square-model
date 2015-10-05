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
module.exports = require("./lib");

},{"./lib":5}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mohayonaoEventEmitter = require("@mohayonao/event-emitter");

var _mohayonaoEventEmitter2 = _interopRequireDefault(_mohayonaoEventEmitter);

var _mohayonaoUtilsDefaults = require("@mohayonao/utils/defaults");

var _mohayonaoUtilsDefaults2 = _interopRequireDefault(_mohayonaoUtilsDefaults);

var _defaultContext = require("./defaultContext");

var _defaultContext2 = _interopRequireDefault(_defaultContext);

var Timeline = (function (_EventEmitter) {
  _inherits(Timeline, _EventEmitter);

  function Timeline() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);

    this.context = (0, _mohayonaoUtilsDefaults2["default"])(opts.context, _defaultContext2["default"]);
    this.interval = (0, _mohayonaoUtilsDefaults2["default"])(opts.interval, 0.025);
    this.aheadTime = (0, _mohayonaoUtilsDefaults2["default"])(opts.aheadTime, 0.1);
    this.timerAPI = (0, _mohayonaoUtilsDefaults2["default"])(opts.timerAPI, global);
    this.playbackTime = this.currentTime;

    this._timerId = 0;
    this._schedId = 0;
    this._events = [];
  }

  _createClass(Timeline, [{
    key: "start",
    value: function start(callback) {
      var _this = this;

      if (this._timerId === 0) {
        this._timerId = this.timerAPI.setInterval(function () {
          var t0 = _this.context.currentTime;
          var t1 = t0 + _this.aheadTime;

          _this._process(t0, t1);
        }, this.interval * 1000);

        this.emit("start");
      }

      if (callback) {
        this.insert(this.context.currentTime, callback);
      }

      return this;
    }
  }, {
    key: "stop",
    value: function stop(reset) {
      if (this._timerId !== 0) {
        this.timerAPI.clearInterval(this._timerId);
        this._timerId = 0;

        this.emit("stop");
      }

      if (reset) {
        this._events.splice(0);
      }

      return this;
    }
  }, {
    key: "insert",
    value: function insert(time, callback, args) {
      var id = ++this._schedId;
      var event = { id: id, time: time, callback: callback, args: args };
      var events = this._events;

      if (events.length === 0 || events[events.length - 1].time <= time) {
        events.push(event);
      } else {
        for (var i = 0, imax = events.length; i < imax; i++) {
          if (time < events[i].time) {
            events.splice(i, 0, event);
            break;
          }
        }
      }

      return id;
    }
  }, {
    key: "nextTick",
    value: function nextTick(time, callback, args) {
      if (typeof time === "function") {
        args = callback;
        callback = time;
        time = this.playbackTime;
      }

      return this.insert(time + this.aheadTime, callback, args);
    }
  }, {
    key: "remove",
    value: function remove(schedId) {
      var events = this._events;

      if (typeof schedId === "number") {
        for (var i = 0, imax = events.length; i < imax; i++) {
          if (schedId === events[i].id) {
            events.splice(i, 1);
            break;
          }
        }
      }

      return schedId;
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      this._events.splice(0);
    }
  }, {
    key: "_process",
    value: function _process(t0, t1) {
      var events = this._events;

      this.playbackTime = t0;
      this.emit("process", { playbackTime: this.playbackTime });

      while (events.length && events[0].time < t1) {
        var _event = events.shift();
        var playbackTime = _event.time;
        var args = _event.args;

        this.playbackTime = playbackTime;

        _event.callback({ playbackTime: playbackTime, args: args });
      }

      this.playbackTime = t0;
      this.emit("processed", { playbackTime: this.playbackTime });
    }
  }, {
    key: "state",
    get: function get() {
      return this._timerId !== 0 ? "running" : "suspended";
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.context.currentTime;
    }
  }, {
    key: "events",
    get: function get() {
      return this._events.slice();
    }
  }]);

  return Timeline;
})(_mohayonaoEventEmitter2["default"]);

exports["default"] = Timeline;
module.exports = exports["default"];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./defaultContext":4,"@mohayonao/event-emitter":1,"@mohayonao/utils/defaults":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Object.defineProperties({}, {
  currentTime: {
    get: function get() {
      return Date.now() / 1000;
    },
    configurable: true,
    enumerable: true
  }
});
module.exports = exports["default"];
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Timeline = require("./Timeline");

var _Timeline2 = _interopRequireDefault(_Timeline);

exports["default"] = _Timeline2["default"];
module.exports = exports["default"];
},{"./Timeline":3}],6:[function(require,module,exports){
module.exports = function(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(value, maxValue));
};

},{}],7:[function(require,module,exports){
module.exports = function(value, defaultValue) {
  return typeof value !== "undefined" ? value : defaultValue;
};

},{}],8:[function(require,module,exports){
module.exports = function(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
};

},{}],9:[function(require,module,exports){
module.exports = function(value, rand) {
  rand = rand || Math.random;

  return (rand() * 2 - 1) * value;
};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
module.exports = function(array, rand) {
  rand = rand || Math.random;

  return array[(rand() * array.length)|0];
};

},{}],12:[function(require,module,exports){
(function (global){
var getAudioContext = require("./getAudioContext");

/* eslint-disable no-unused-vars */

module.exports = function(audioContext, callback) {
  var memo = null;

  if (!("ontouchend" in global)) {
    if (typeof callback === "function") {
      setTimeout(callback, 0);
    }
    return audioContext;
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

    global.removeEventListener("touchend", choreFunction);
  }

  global.addEventListener("touchend", choreFunction);

  return audioContext;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./getAudioContext":14}],13:[function(require,module,exports){
(function (global){
var getAudioContext = require("./getAudioContext");

function fetchWithXHR(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new global.XMLHttpRequest();

    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function() {
      resolve({
        arrayBuffer: function() {
          return xhr.response;
        },
      });
    };

    xhr.onerror = function() {
      // TODO: error object
      reject({});
    };

    xhr.send();
  });
}

module.exports = function(path, audioContext) {
  audioContext = audioContext || getAudioContext();

  return new Promise(function(resolve, reject) {
    fetchWithXHR(path).then(function(res) {
      return res.arrayBuffer();
    }).then(function(audioData) {
      audioContext.decodeAudioData(audioData, resolve, reject);
    });
  });
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./getAudioContext":14}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
(function (global){
"use strict";

if (!(global === global.window && global.URL && global.Blob && global.Worker)) {
  module.exports = global;
} else {
  module.exports = (function() {
    var TIMER_WORKER_SOURCE = [
      "var timerIds = {}, _ = {};",
      "_.setInterval = function(args) {",
      "  timerIds[args.timerId] = setInterval(function() { postMessage(args.timerId); }, args.delay);",
      "};",
      "_.clearInterval = function(args) {",
      "  clearInterval(timerIds[args.timerId]);",
      "};",
      "_.setTimeout = function(args) {",
      "  timerIds[args.timerId] = setTimeout(function() { postMessage(args.timerId); }, args.delay);",
      "};",
      "_.clearTimeout = function(args) {",
      "  clearTimeout(timerIds[args.timerId]);",
      "};",
      "onmessage = function(e) { _[e.data.type](e.data) };"
    ].join("");

    var _timerId = 0;
    var _callbacks = {};
    var _timer = new global.Worker(global.URL.createObjectURL(
      new global.Blob([ TIMER_WORKER_SOURCE ], { type: "text/javascript" })
    ));

    _timer.onmessage = function(e) {
      if (_callbacks[e.data]) {
        _callbacks[e.data]();
      }
    };

    return {
      setInterval: function(callback, delay) {
        _timerId += 1;

        _timer.postMessage({ type: "setInterval", timerId: _timerId, delay: delay });
        _callbacks[_timerId] = callback;

        return _timerId;
      },
      setTimeout: function(callback, delay) {
        _timerId += 1;

        _timer.postMessage({ type: "setTimeout", timerId: _timerId, delay: delay });
        _callbacks[_timerId] = callback;

        return _timerId;
      },
      clearInterval: function(timerId) {
        _timer.postMessage({ type: "clearInterval", timerId: timerId });
        _callbacks[timerId] = null;
      },
      clearTimeout: function(timerId) {
        _timer.postMessage({ type: "clearTimeout", timerId: timerId });
        _callbacks[timerId] = null;
      }
    };
  })();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoTimeline = require("@mohayonao/timeline");

var _mohayonaoTimeline2 = _interopRequireDefault(_mohayonaoTimeline);

var _workerTimer = require("worker-timer");

var _workerTimer2 = _interopRequireDefault(_workerTimer);

var _modelModel = require("../model/Model");

var _modelModel2 = _interopRequireDefault(_modelModel);

var _FrameViewer = require("./FrameViewer");

var _FrameViewer2 = _interopRequireDefault(_FrameViewer);

var _ModelViewer = require("./ModelViewer");

var _ModelViewer2 = _interopRequireDefault(_ModelViewer);

var _RelaySound = require("./RelaySound");

var _RelaySound2 = _interopRequireDefault(_RelaySound);

var _mohayonaoUtilsRand2 = require("@mohayonao/utils/rand2");

var _mohayonaoUtilsRand22 = _interopRequireDefault(_mohayonaoUtilsRand2);

var App = (function () {
  function App(audioContext) {
    _classCallCheck(this, App);

    var frameCanvas = document.getElementById("frame");

    frameCanvas.width = frameCanvas.clientWidth;
    frameCanvas.height = frameCanvas.clientHeight;
    this.frameViewer = new _FrameViewer2["default"](frameCanvas);

    this.audioContext = audioContext;
    this.isPlaying = false;
    this.startTime = 0;
    this.timeline = new _mohayonaoTimeline2["default"]({ context: this.audioContext, timerAPI: _workerTimer2["default"] });

    this.state = {
      relays: true,
      mobile: true,
      antiQuantize: true
    };

    this.$onProcess = this.$onProcess.bind(this);
  }

  _createClass(App, [{
    key: "setState",
    value: function setState(state) {
      this.state = state;
    }
  }, {
    key: "setConfig",
    value: function setConfig(config) {
      this.config = {
        ITER_COUNT: config.ITER_COUNT,
        SUGAR_INIT: config.SUGAR_INIT,
        SUGAR_RECOVERY_NUM: config.SUGAR_RECOVERY_NUM,
        VIEW_WIDTH: config.VIEW_WIDTH,
        POOL_INIT: config.POOL_INIT,
        TAKE_INIT: config.TAKE_INIT,
        APPETITE_INIT: config.APPETITE_INIT,
        BORN_LINE_OF_POOL: config.BORN_LINE_OF_POOL,
        MOVE_RATE: config.MOVE_RATE,
        MOBILE_RATE: config.MOBILE_RATE
      };
      this.model = new _modelModel2["default"](this.config);
      this.frames = this.model.build(this.config.ITER_COUNT);

      var interval = 5;
      var time = 0;
      var decreaseInterval = 0.05;
      var minInterval = 0.25;

      this.frames.forEach(function (frame, index) {
        frame.time = time + (0, _mohayonaoUtilsRand22["default"])(0.25, function () {
          return (Math.random() + Math.random()) / 2;
        });
        frame.index = index;

        time += interval;
        interval = Math.max(interval - decreaseInterval, minInterval);
      });

      this.frameViewer.draw(this.frames, this.model);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      if (this.isPlaying || !this.frames) {
        return;
      }
      this.isPlaying = true;

      var modelCanvas = document.getElementById("model");

      modelCanvas.width = modelCanvas.clientWidth;
      modelCanvas.height = modelCanvas.clientHeight;
      this.modelViewer = new _ModelViewer2["default"](modelCanvas);

      this.startTime = this.timeline.currentTime + 1;
      this.events = [];

      this.frames.forEach(function (frame) {
        var playbackTime = _this.startTime + frame.time;

        _this.events.push({ playbackTime: playbackTime, frame: frame });
      });

      this.timeline.start(this.$onProcess);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isPlaying = false;
    }
  }, {
    key: "renewEvents",
    value: function renewEvents() {
      var _this2 = this;

      this.setConfig(this.config);

      this.startTime = this.timeline.currentTime + 1;
      this.events = [];

      this.frames.forEach(function (frame) {
        var playbackTime = _this2.startTime + frame.time;

        _this2.events.push({ playbackTime: playbackTime, frame: frame });
      });
    }
  }, {
    key: "$onProcess",
    value: function $onProcess(_ref) {
      var _this3 = this;

      var playbackTime = _ref.playbackTime;

      var time = playbackTime - this.startTime;

      if (0 < time) {
        this.frameViewer.revert();
        this.frameViewer.drawFrameSeek(time);
        this.modelViewer.draw(time);

        while (this.events.length && this.events[0].playbackTime < playbackTime) {
          var frame = this.events.shift().frame;

          this.modelViewer.update(frame, this.model);

          frame.ants.filter(function (ant) {
            return ant.updated;
          }).forEach(function (ant) {
            var t0 = playbackTime;

            if (_this3.state.antiQuantize) {
              t0 += Math.random() * 0.5;
            }

            if (ant.mobile) {
              if (_this3.state.mobile) {
                var sound = new _RelaySound2["default"](_this3.audioContext, ant.position);

                sound.start(t0);
                sound.outlet.connect(_this3.audioContext.destination);
              }
            }
            if (!ant.mobile) {
              _this3.modelViewer.bang(ant.position);

              if (_this3.state.relays) {
                var sound = new _RelaySound2["default"](_this3.audioContext, ant.position);

                sound.start(t0);
                sound.outlet.connect(_this3.audioContext.destination);
              }
            }
          });
        }
      }

      if (this.events.length === 0) {
        this.renewEvents();
      }

      if (this.isPlaying) {
        this.timeline.insert(playbackTime + 0.05, this.$onProcess);
      }
    }
  }]);

  return App;
})();

exports["default"] = App;
module.exports = exports["default"];

},{"../model/Model":24,"./FrameViewer":17,"./ModelViewer":18,"./RelaySound":19,"@mohayonao/timeline":2,"@mohayonao/utils/rand2":9,"worker-timer":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsLinlin = require("@mohayonao/utils/linlin");

var _mohayonaoUtilsLinlin2 = _interopRequireDefault(_mohayonaoUtilsLinlin);

var _mohayonaoUtilsRange = require("@mohayonao/utils/range");

var _mohayonaoUtilsRange2 = _interopRequireDefault(_mohayonaoUtilsRange);

var FrameViewer = (function () {
  function FrameViewer(canvas) {
    _classCallCheck(this, FrameViewer);

    this.canvas = canvas;
    this.imageData = null;
    this.frameLength = 0;
    this.duration = 0;
  }

  _createClass(FrameViewer, [{
    key: "draw",
    value: function draw(frames, model) {
      var canvas = this.canvas;
      var context = canvas.getContext("2d");

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      this.duration = frames[frames.length - 1].time;
      this.drawFrames(canvas, context, frames, model);

      this.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      this.frameLength = frames.length;
    }
  }, {
    key: "revert",
    value: function revert() {
      if (this.imageData === null) {
        return;
      }
      var canvas = this.canvas;
      var context = canvas.getContext("2d");

      context.putImageData(this.imageData, 0, 0);
    }
  }, {
    key: "drawFrameSeek",
    value: function drawFrameSeek(time) {
      var canvas = this.canvas;
      var context = canvas.getContext("2d");
      var y0 = time / this.duration * canvas.height;

      context.strokeStyle = "#f00";
      context.beginPath();
      context.moveTo(0, y0);
      context.lineTo(canvas.width, y0);
      context.stroke();
    }
  }, {
    key: "drawFrames",
    value: function drawFrames(canvas, context, frames, model) {
      var _this = this;

      var dy = canvas.height / frames.length;
      var dx = 15;

      frames.forEach(function (_ref, i) {
        var time = _ref.time;
        var grids = _ref.grids;
        var ants = _ref.ants;

        var y0 = time / _this.duration * canvas.height;

        if (i % 25 === 0) {
          context.fillStyle = "#fff";
          context.fillText(time | 0, 2, y0 + 10);
        }

        grids.forEach(function (_ref2, j) {
          var resource = _ref2.resource;

          var x0 = j * dx;
          var gray = (0, _mohayonaoUtilsLinlin2["default"])(resource, 0, model.SUGAR_INIT, 224, 0) | 0;

          context.fillStyle = toColor(gray, gray, gray);
          context.fillRect(25 + x0, y0, dx, canvas.height - y0);
        });

        var relaySounds = (0, _mohayonaoUtilsRange2["default"])(grids.length).map(function () {
          return 0;
        });

        ants.filter(function (ant) {
          return ant.updated && !ant.mobile;
        }).forEach(function (_ref3) {
          var position = _ref3.position;

          relaySounds[position] += 1;
        });

        context.fillStyle = "rgba(255, 255, 255, 0.8)";

        relaySounds.forEach(function (count, position) {
          var x0 = position * dx;
          var r = count;

          context.beginPath();
          context.arc(175 + x0 + dx * 0.5, y0 + dy * 0.5, r, 0, 2 * Math.PI, false);
          context.fill();
        });

        var mobileCount = ants.filter(function (ant) {
          return ant.mobile;
        }).length;
        var r = mobileCount;

        context.fillStyle = "rgba(24, 255, 192, 0.8)";

        context.beginPath();
        context.arc(325 + dx * 0.5, y0 + dy * 0.5, r, 0, 2 * Math.PI, false);
        context.fill();

        if (i % 25 === 0) {
          context.fillStyle = "#fff";
          context.fillText(ants.length, 350, y0 + 10);
        }
        if (i === frames.length - 1) {
          context.fillStyle = "#fff";
          context.fillText(ants.length, 350, y0);
        }
      });
    }
  }]);

  return FrameViewer;
})();

exports["default"] = FrameViewer;

function toColor(r, g, b) {
  return "#" + [r, g, b].map(function (x) {
    return ("00" + (x | 0).toString(16)).substr(-2);
  }).join("");
}
module.exports = exports["default"];

},{"@mohayonao/utils/linlin":8,"@mohayonao/utils/range":10}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsLinlin = require("@mohayonao/utils/linlin");

var _mohayonaoUtilsLinlin2 = _interopRequireDefault(_mohayonaoUtilsLinlin);

var _mohayonaoUtilsRand2 = require("@mohayonao/utils/rand2");

var _mohayonaoUtilsRand22 = _interopRequireDefault(_mohayonaoUtilsRand2);

var _mohayonaoUtilsConstrain = require("@mohayonao/utils/constrain");

var _mohayonaoUtilsConstrain2 = _interopRequireDefault(_mohayonaoUtilsConstrain);

var ModelViewer = (function () {
  function ModelViewer(canvas) {
    _classCallCheck(this, ModelViewer);

    this.canvas = canvas;
    this.real = new Float32Array(9);
    this.imag = new Float32Array(9);
    this.resources = new Uint16Array(9);
  }

  _createClass(ModelViewer, [{
    key: "draw",
    value: function draw(time) {
      var canvas = this.canvas;
      var context = canvas.getContext("2d");
      var msec = Math.floor(time * 1000) % 1000;
      var seconds = Math.floor(time) % 60;
      var minutes = Math.floor(time / 60);

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, 64);

      context.fillStyle = "#fff";
      context.fillText(zero2(minutes) + ":" + zero2(seconds) + "." + zero3(msec), 2, 12);

      this.drawGrids(time, canvas, context);
    }
  }, {
    key: "update",
    value: function update(_ref, model) {
      var _this = this;

      var grids = _ref.grids;
      var ants = _ref.ants;

      var canvas = this.canvas;
      var context = canvas.getContext("2d");

      grids.forEach(function (grid, index) {
        _this.real[index] = (1 - grid.resource / model.SUGAR_INIT) * 0.75;
        _this.resources[index] = grid.resource;
      });

      this.drawAnts(canvas, context, ants, model);
    }
  }, {
    key: "bang",
    value: function bang(position) {
      this.imag[position] = 1;
    }
  }, {
    key: "drawGrids",
    value: function drawGrids(time, canvas, context) {
      var dx = canvas.width / this.real.length;
      var dy = 48;
      var r = Math.min(dx, dy) * 0.45;

      for (var i = 0; i < this.real.length; i++) {
        var x0 = i * dx;
        var y0 = 16;
        var diff = (this.real[i] - this.imag[i]) * 0.125;
        var str = this.resources[i] | 0;
        var mx = context.measureText(str).width * 0.5;
        var fontColor = "#fff";

        this.imag[i] += diff;

        var z = this.imag[i];

        z = (0, _mohayonaoUtilsConstrain2["default"])((0, _mohayonaoUtilsLinlin2["default"])(z, 0, 1, 8, 255) + (0, _mohayonaoUtilsRand22["default"])(8), 0, 255);

        context.fillStyle = toColor(z, z * 0.75, z * 0.1);
        context.beginPath();
        context.arc(x0 + dx * 0.5, y0 + dy * 0.5, r, 0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = fontColor;
        context.fillText(str, x0 + dx * 0.5 - mx, y0 + 26);
      }
    }
  }, {
    key: "drawAnts",
    value: function drawAnts(canvas, context, ants, model) {
      context.fillStyle = "#000";
      context.fillRect(0, 64, canvas.width, canvas.height);

      ants.forEach(function (ant, index) {
        var dx = canvas.width / model.grids.length;
        var dy = (canvas.height - 64) / ants.length;
        var x0 = dx * ant.position;
        var y0 = dy * index + 64;
        var str = "" + (ant.pool | 0);
        var mx = context.measureText(str).width * 0.5;

        if (ant.mobile) {
          context.fillStyle = "#ff6666";
        } else {
          context.fillStyle = "#ffffff";
        }

        context.fillText(str, x0 + dx * 0.5 - mx, y0 + dy * 0.5);
      });
    }
  }]);

  return ModelViewer;
})();

exports["default"] = ModelViewer;

function toColor(r, g, b) {
  return "#" + [r, g, b].map(function (x) {
    return ("00" + (x | 0).toString(16)).substr(-2);
  }).join("");
}

function zero2(num) {
  return num < 10 ? "0" + num : num;
}

function zero3(num) {
  return num < 100 ? "00" + num : zero2(num);
}
module.exports = exports["default"];

},{"@mohayonao/utils/constrain":6,"@mohayonao/utils/linlin":8,"@mohayonao/utils/rand2":9}],19:[function(require,module,exports){
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

},{"./sounds":21,"@mohayonao/event-emitter":1}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Application = require("./Application");

var _Application2 = _interopRequireDefault(_Application);

exports["default"] = _Application2["default"];
module.exports = exports["default"];

},{"./Application":16}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mohayonaoWebAudioUtilsGetAudioContext = require("@mohayonao/web-audio-utils/getAudioContext");

var _mohayonaoWebAudioUtilsGetAudioContext2 = _interopRequireDefault(_mohayonaoWebAudioUtilsGetAudioContext);

var _mohayonaoWebAudioUtilsFetchAudioBuffer = require("@mohayonao/web-audio-utils/fetchAudioBuffer");

var _mohayonaoWebAudioUtilsFetchAudioBuffer2 = _interopRequireDefault(_mohayonaoWebAudioUtilsFetchAudioBuffer);

var audioContext = (0, _mohayonaoWebAudioUtilsGetAudioContext2["default"])();
var sounds = [];

["01.wav", "02.wav", "03.wav", "04.wav", "05.wav", "06.wav", "07.wav", "08.wav", "09.wav"].forEach(function (filename, index) {
  (0, _mohayonaoWebAudioUtilsFetchAudioBuffer2["default"])("./assets/sounds/" + filename, audioContext).then(function (audioBuffer) {
    sounds[index] = audioBuffer;
  });
});

exports["default"] = {
  get: function get(index) {
    return sounds[index] || null;
  }
};
module.exports = exports["default"];

},{"@mohayonao/web-audio-utils/fetchAudioBuffer":13,"@mohayonao/web-audio-utils/getAudioContext":14}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsSample = require("@mohayonao/utils/sample");

var _mohayonaoUtilsSample2 = _interopRequireDefault(_mohayonaoUtilsSample);

var _of = require("./of");

var Ant = (function () {
  function Ant(model) {
    _classCallCheck(this, Ant);

    this.model = model;

    this.death = false;
    this.take = this.model.TAKE_INIT;
    this.appetite = this.model.APPETITE_INIT;
    this.pool = this.model.POOL_INIT;

    this.position = (0, _of.ofRandomInt)(this.model.grids.length - 1);
    this.updated = false;
    this.mobile = false;
  }

  _createClass(Ant, [{
    key: "toJSON",
    value: function toJSON() {
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
  }, {
    key: "move",
    value: function move() {
      var _this = this;

      var hungerRate = this.pool / this.model.BORN_LINE_OF_POOL;
      var moveRate = this.model.MOVE_RATE * hungerRate;

      if (!(Math.random() < moveRate)) {
        return;
      }

      if (Math.random() < this.model.MOBILE_RATE) {
        this.mobile = true;
        this.updated = true;
        return;
      }

      var grids = this.model.grids.filter(function (grid, index) {
        var minPosition = _this.position - _this.model.VIEW_WIDTH;
        var maxPosition = _this.position + _this.model.VIEW_WIDTH;

        return minPosition <= index && index <= maxPosition;
      });
      var maxResource = grids.reduce(function (maxValue, grid) {
        return Math.max(maxValue, grid.resource);
      }, 0);
      var candidates = grids.filter(function (grid) {
        return grid.resource === maxResource;
      });

      if (candidates.length) {
        var position = (0, _mohayonaoUtilsSample2["default"])(candidates).index;
        if (position !== this.position) {
          this.position = position;
          this.updated = true;
        }
      }
    }
  }, {
    key: "eat",
    value: function eat() {
      var take = Math.min(this.model.grids[this.position].resource, this.take);

      this.pool += take;
      this.pool -= this.appetite;

      this.model.grids[this.position].decrease(take);
    }
  }]);

  return Ant;
})();

exports["default"] = Ant;
module.exports = exports["default"];

},{"./of":25,"@mohayonao/utils/sample":11}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = (function () {
  function Grid(model, index) {
    _classCallCheck(this, Grid);

    this.model = model;
    this.index = index;
    this.resource = this.model.SUGAR_INIT;
  }

  _createClass(Grid, [{
    key: "toJSON",
    value: function toJSON() {
      return {
        index: this.index,
        resource: this.resource
      };
    }
  }, {
    key: "decrease",
    value: function decrease(num) {
      this.resource = Math.max(0, this.resource - num);
    }
  }, {
    key: "recovery",
    value: function recovery() {
      this.resource = Math.min(this.resource + this.model.SUGAR_RECOVERY_NUM, this.model.SUGAR_INIT);
    }
  }]);

  return Grid;
})();

exports["default"] = Grid;
module.exports = exports["default"];

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _mohayonaoUtilsRange = require("@mohayonao/utils/range");

var _mohayonaoUtilsRange2 = _interopRequireDefault(_mohayonaoUtilsRange);

var _mohayonaoUtilsDefaults = require("@mohayonao/utils/defaults");

var _mohayonaoUtilsDefaults2 = _interopRequireDefault(_mohayonaoUtilsDefaults);

var _Grid = require("./Grid");

var _Grid2 = _interopRequireDefault(_Grid);

var _Ant = require("./Ant");

var _Ant2 = _interopRequireDefault(_Ant);

var Model = (function () {
  function Model(params) {
    _classCallCheck(this, Model);

    this.GRID_NUM_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.GRID_NUM_INIT, 9);
    this.ANT_NUM_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.ANT_NUM_INIT, 1);
    this.SUGAR_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.SUGAR_INIT, 256);
    this.SUGAR_RECOVERY_NUM = (0, _mohayonaoUtilsDefaults2["default"])(params.SUGAR_RECOVERY_NUM, 4);
    this.VIEW_WIDTH = (0, _mohayonaoUtilsDefaults2["default"])(params.VIEW_WIDTH, 2);
    this.POOL_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.POOL_INIT, 2);
    this.TAKE_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.TAKE_INIT, 6);
    this.APPETITE_INIT = (0, _mohayonaoUtilsDefaults2["default"])(params.APPETITE_INIT, 1);
    this.MOVE_RATE = (0, _mohayonaoUtilsDefaults2["default"])(params.MOVE_RATE, 0.7);
    this.MOBILE_RATE = (0, _mohayonaoUtilsDefaults2["default"])(params.MOBILE_RATE, 0.2);
    this.BORN_LINE_OF_POOL = (0, _mohayonaoUtilsDefaults2["default"])(params.BORN_LINE_OF_POOL, this.POOL_INIT * 100);
    this.DEATH_LINE_OF_POOL = (0, _mohayonaoUtilsDefaults2["default"])(params.DEATH_LINE_OF_POOL, 0);
    this.reset();
  }

  _createClass(Model, [{
    key: "reset",
    value: function reset() {
      var _this = this;

      this.grids = (0, _mohayonaoUtilsRange2["default"])(this.GRID_NUM_INIT).map(function (index) {
        return new _Grid2["default"](_this, index);
      });
      this.ants = (0, _mohayonaoUtilsRange2["default"])(this.ANT_NUM_INIT).map(function () {
        return new _Ant2["default"](_this);
      });
    }
  }, {
    key: "build",
    value: function build(numOfFrames) {
      var _this2 = this;

      return (0, _mohayonaoUtilsRange2["default"])(numOfFrames).map(function () {
        _this2.update();

        var grids = _this2.grids.map(function (grid) {
          return grid.toJSON();
        });
        var ants = _this2.ants.map(function (ant) {
          return ant.toJSON();
        });

        return { grids: grids, ants: ants };
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.gridsRecovery();
      this.behaveAnts();
      this.bornAndDeath();
    }
  }, {
    key: "behaveAnts",
    value: function behaveAnts() {
      this.ants.forEach(function (ant) {
        ant.updated = false;
        ant.mobile = false;
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
      var _this3 = this;

      this.ants.forEach(function (ant) {
        if (ant.pool >= _this3.BORN_LINE_OF_POOL) {
          // Decreases it's pool
          ant.pool >>= 1;

          var a = new _Ant2["default"](_this3);

          a.pool = ant.pool;
          _this3.ants.push(a);

          // Notification the born event to square for changing clock time
          // let num = this.ants.length;
          // notice.notify("BORN", num);
        } else if (ant.pool <= _this3.DEATH_LINE_OF_POOL) {
            ant.death = true;
          }
      });

      // Remove flg agents
      this.ants = this.ants.filter(function (ant) {
        return !ant.death;
      });

      if (this.ants.length === 0) {
        this.ants.push(new _Ant2["default"](this));
      }
    }
  }]);

  return Model;
})();

exports["default"] = Model;
module.exports = exports["default"];

},{"./Ant":22,"./Grid":23,"@mohayonao/utils/defaults":7,"@mohayonao/utils/range":10}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ofRandomInt = ofRandomInt;

function ofRandomInt(num) {
  return Math.random() * (num + 1) | 0;
}

},{}],26:[function(require,module,exports){
(function (global){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mohayonaoWebAudioUtilsGetAudioContext = require("@mohayonao/web-audio-utils/getAudioContext");

var _mohayonaoWebAudioUtilsGetAudioContext2 = _interopRequireDefault(_mohayonaoWebAudioUtilsGetAudioContext);

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay = require("@mohayonao/web-audio-utils/enableMobileAutoPlay");

var _mohayonaoWebAudioUtilsEnableMobileAutoPlay2 = _interopRequireDefault(_mohayonaoWebAudioUtilsEnableMobileAutoPlay);

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

global.addEventListener("DOMContentLoaded", function () {
  var audioContext = (0, _mohayonaoWebAudioUtilsGetAudioContext2["default"])();
  var app = new _app2["default"](audioContext);

  (0, _mohayonaoWebAudioUtilsEnableMobileAutoPlay2["default"])(audioContext);

  var vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false,
      tabId: "tab1",
      ITER_COUNT: 300,
      SUGAR_INIT: 256,
      SUGAR_RECOVERY_NUM: 5,
      VIEW_WIDTH: 2,
      POOL_INIT: 4,
      TAKE_INIT: 19,
      APPETITE_INIT: 10,
      BORN_LINE_OF_POOL: 300,
      MOVE_RATE: 0.8,
      MOBILE_RATE: 0.15,
      relays: true,
      mobile: true,
      antiQuantize: true,
      url: "",
      json: ""
    },
    methods: {
      updateConfig: function updateConfig() {
        var json = this.toJSON();

        app.setConfig(json);

        this.url = location.origin + "/#" + encodeURIComponent(JSON.stringify(json));
        this.json = JSON.stringify(json, null, 2);
      },
      updateState: function updateState() {
        app.setState({
          relays: this.relays,
          mobile: this.mobile,
          antiQuantize: this.antiQuantize
        });
      },
      changeTab: function changeTab(tabId) {
        this.tabId = tabId;
      },
      toJSON: function toJSON() {
        return {
          ITER_COUNT: this.ITER_COUNT,
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
      start: function start() {
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
    (function () {
      var hash = decodeURIComponent(location.hash.slice(1));
      var json = undefined;

      try {
        json = JSON.parse(hash);
      } catch (e) {
        json = {};
      }

      Object.keys(json).forEach(function (key) {
        if (vue.hasOwnProperty(key)) {
          vue[key] = json[key];
        }
      });
    })();
  }

  vue.updateConfig();
  vue.updateState();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":20,"@mohayonao/web-audio-utils/enableMobileAutoPlay":12,"@mohayonao/web-audio-utils/getAudioContext":14}]},{},[26]);
