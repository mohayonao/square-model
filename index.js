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
module.exports = function(array, target) {
  var index = array.indexOf(target);

  if (index !== -1) {
    return false;
  }

  array.push(target);

  return true;
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

},{}],10:[function(require,module,exports){
module.exports = function(array, target) {
  var index = array.indexOf(target);

  if (index === -1) {
    return false;
  }

  array.splice(index, 1);

  return true;
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

var _mohayonaoUtilsAppendIfNotExists = require("@mohayonao/utils/appendIfNotExists");

var _mohayonaoUtilsAppendIfNotExists2 = _interopRequireDefault(_mohayonaoUtilsAppendIfNotExists);

var _mohayonaoUtilsRemoveIfExists = require("@mohayonao/utils/removeIfExists");

var _mohayonaoUtilsRemoveIfExists2 = _interopRequireDefault(_mohayonaoUtilsRemoveIfExists);

var _mohayonaoUtilsSample = require("@mohayonao/utils/sample");

var _mohayonaoUtilsSample2 = _interopRequireDefault(_mohayonaoUtilsSample);

var _mohayonaoTimeline = require("@mohayonao/timeline");

var _mohayonaoTimeline2 = _interopRequireDefault(_mohayonaoTimeline);

var _workerTimer = require("worker-timer");

var _workerTimer2 = _interopRequireDefault(_workerTimer);

var _modelConfig = require("../model/config");

var _ModelView = require("./ModelView");

var _ModelView2 = _interopRequireDefault(_ModelView);

var _modelModel = require("../model/Model");

var _modelModel2 = _interopRequireDefault(_modelModel);

var App = (function () {
  function App(audioContext) {
    _classCallCheck(this, App);

    this.audioContext = audioContext;
    this.modelView = new _ModelView2["default"](this.audioContext, null);
    this.isPlaying = false;
    this.startTime = 0;
    this.timeline = new _mohayonaoTimeline2["default"]({ context: this.audioContext, timerAPI: _workerTimer2["default"] });
    this.$onProcess = this.$onProcess.bind(this);
  }

  _createClass(App, [{
    key: "addMobile",
    value: function addMobile() {}
  }, {
    key: "removeMobile",
    value: function removeMobile() {}
  }, {
    key: "start",
    value: function start() {
      if (this.isPlaying) {
        return;
      }
      this.modelView.model = new _modelModel2["default"]();
      this.isPlaying = true;
      this.startTime = Date.now();
      this.timeline.start(this.$onProcess);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isPlaying = false;
    }
  }, {
    key: "$onProcess",
    value: function $onProcess(_ref) {
      var playbackTime = _ref.playbackTime;

      var elapsed = (Date.now() - this.startTime) * 0.001;

      if (_modelConfig.RESET_INTERVAL <= elapsed) {
        this.modelView.model = new _modelModel2["default"]();
        this.startTime = Date.now();
        console.log("reset");
      }

      this.modelView.update(this.audioContext.currentTime);

      if (this.isPlaying) {
        this.timeline.insert(playbackTime + _modelConfig.CLOCK_INTERVAL, this.$onProcess);
      }
    }
  }]);

  return App;
})();

exports["default"] = App;
module.exports = exports["default"];

},{"../model/Model":24,"../model/config":25,"./ModelView":17,"@mohayonao/timeline":2,"@mohayonao/utils/appendIfNotExists":6,"@mohayonao/utils/removeIfExists":10,"@mohayonao/utils/sample":11,"worker-timer":15}],17:[function(require,module,exports){
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
    this.viewer = new _Viewer2["default"](this);

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

      var phaseTime = _modelConfig.CLOCK_INTERVAL / this.model.ants.length;

      this.model.update();
      this.viewer.update();
      this.model.ants.forEach(function (ant, index) {
        if (ant.updated && ant.mobile) {
          (function () {
            var grid = _this2.model.grids[ant.position];
            var relay = new _RelaySound2["default"](_this2.audioContext, grid.index);
            var soundPlaybackTime = playbackTime;

            soundPlaybackTime += phaseTime * index;

            relay.start(soundPlaybackTime);
            relay.on("ended", function () {
              relay.outlet.disconnect();
              relay.dispose();
              (0, _mohayonaoUtilsRemoveIfExists2["default"])(GCGuard, relay);
            });
            (0, _mohayonaoUtilsAppendIfNotExists2["default"])(GCGuard, relay);

            relay.outlet.connect(_this2.audioContext.destination);
          })();
        }
      });
    }
  }]);

  return ModelView;
})(_mohayonaoEventEmitter2["default"]);

exports["default"] = ModelView;
module.exports = exports["default"];

},{"../model/config":25,"./RelaySound":18,"./Viewer":19,"@mohayonao/event-emitter":1,"@mohayonao/utils/appendIfNotExists":6,"@mohayonao/utils/removeIfExists":10}],18:[function(require,module,exports){
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

},{"./sounds":21,"@mohayonao/event-emitter":1}],19:[function(require,module,exports){
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
  function Viewer(modelView) {
    _classCallCheck(this, Viewer);

    this.modelView = modelView;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    this.context.font = "400 12px 'Courier', monospace";
  }

  _createClass(Viewer, [{
    key: "update",
    value: function update() {
      var modelView = this.modelView;
      var canvas = this.canvas;
      var context = this.context;
      var model = modelView.model;

      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // draw grid
      model.grids.forEach(function (grid, index) {
        var dx = canvas.width / model.grids.length;
        var dy = 64;
        var x0 = dx * index;
        var y0 = 0;
        var gray = (0, _mohayonaoUtilsLinlin2["default"])(grid.resource, 0, _modelConfig.SUGAR_INIT, 255, 32) | 0;
        var str = "" + (grid.resource | 0);
        var mx = context.measureText(str).width * 0.5;
        var fontColor = "#000";

        context.fillStyle = toColor(gray, gray, gray);
        context.fillRect(x0, y0, dx, dy);

        if (gray < 192) {
          fontColor = "#fff";
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

  return Viewer;
})();

exports["default"] = Viewer;

function toColor(r, g, b) {
  return "#" + [r, g, b].map(function (x) {
    return ("00" + x.toString(16)).substr(-2);
  }).join("");
}
module.exports = exports["default"];

},{"../model/config":25,"@mohayonao/utils/linlin":8}],20:[function(require,module,exports){
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

var _config = require("./config");

var Ant = (function () {
  function Ant(model) {
    _classCallCheck(this, Ant);

    this.death = false;
    this.view = _config.VIEW_INIT;
    this.take = _config.TAKE_INIT;
    this.appetite = _config.APPETITE_INIT;
    this.pool = _config.POOL_INIT;

    this.model = model;
    this.position = (0, _of.ofRandomInt)(this.model.grids.length - 1);
    this.updated = false;
    this.mobile = false;
  }

  _createClass(Ant, [{
    key: "move",
    value: function move() {
      var _this = this;

      if (!(Math.random() < _config.MOVE_RATE)) {
        return;
      }

      var grids = this.model.grids.filter(function (grid, index) {
        var minPosition = _this.position - _config.VIEW_WIDTH;
        var maxPosition = _this.position + _config.VIEW_WIDTH;

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
          if (Math.random() < _config.MOBILE_RATE) {
            this.mobile = true;
          }
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

},{"./config":25,"./of":26,"@mohayonao/utils/sample":11}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = require("./config");

var _of = require("./of");

var Grid = (function () {
  function Grid(model, index) {
    _classCallCheck(this, Grid);

    this.model = model;
    this.index = index;
    this.resource = (0, _of.ofRandomInt)(_config.SUGAR_INIT + 1);
  }

  _createClass(Grid, [{
    key: "decrease",
    value: function decrease(num) {
      this.resource = Math.max(0, this.resource - num);
    }
  }, {
    key: "recovery",
    value: function recovery() {
      this.resource = Math.min(this.resource + _config.SUGAR_RECOVERY_NUM, _config.SUGAR_INIT);
    }
  }]);

  return Grid;
})();

exports["default"] = Grid;
module.exports = exports["default"];

},{"./config":25,"./of":26}],24:[function(require,module,exports){
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

    this.grids = (0, _mohayonaoUtilsRange2["default"])(_config.GRID_NUM_INIT).map(function (index) {
      return new _Grid2["default"](_this, index);
    });
    this.ants = (0, _mohayonaoUtilsRange2["default"])(_config.ANT_NUM_INIT).map(function () {
      return new _Ant2["default"](_this);
    });
  }

  _createClass(Model, [{
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
      var _this2 = this;

      this.ants.forEach(function (ant) {
        if (ant.pool >= _config.BORN_LINE_OF_POOL) {
          // Decreases it's pool
          ant.pool >>= 1;

          var a = new _Ant2["default"](_this2);

          a.pool = ant.pool;
          _this2.ants.push(a);

          // Notification the born event to square for changing clock time
          // let num = this.ants.length;
          // notice.notify("BORN", num);
        } else if (ant.pool <= _config.DEATH_LINE_OF_POOL) {
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

},{"./Ant":22,"./Grid":23,"./config":25,"@mohayonao/utils/range":9}],25:[function(require,module,exports){
// System
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RESET_INTERVAL = 120;
var CLOCK_INTERVAL = 0.5;
var CLOCK_INCREASING_FIX = 1.8;
var GRID_NUM_INIT = 9;
var ANT_NUM_INIT = 1;

// GRID Richness
var SUGAR_INIT = 32;
var SUGAR_RECOVERY_NUM = 5;

// ANT PARAM
var VIEW_WIDTH = 3;
var VIEW_INIT = 1;
var POOL_INIT = 4;
var TAKE_INIT = 9;
var APPETITE_INIT = 5;
var MOVE_RATE = 0.7;
var MOBILE_RATE = 0.2;

// Dead or Arrive
var BORN_LINE_OF_POOL = POOL_INIT * 100;
var DEATH_LINE_OF_POOL = 0;

exports["default"] = {
  RESET_INTERVAL: RESET_INTERVAL,
  CLOCK_INTERVAL: CLOCK_INTERVAL,
  CLOCK_INCREASING_FIX: CLOCK_INCREASING_FIX,
  GRID_NUM_INIT: GRID_NUM_INIT,
  ANT_NUM_INIT: ANT_NUM_INIT,
  SUGAR_INIT: SUGAR_INIT,
  SUGAR_RECOVERY_NUM: SUGAR_RECOVERY_NUM,
  VIEW_WIDTH: VIEW_WIDTH,
  VIEW_INIT: VIEW_INIT,
  POOL_INIT: POOL_INIT,
  TAKE_INIT: TAKE_INIT,
  APPETITE_INIT: APPETITE_INIT,
  MOVE_RATE: MOVE_RATE,
  MOBILE_RATE: MOBILE_RATE,
  BORN_LINE_OF_POOL: BORN_LINE_OF_POOL,
  DEATH_LINE_OF_POOL: DEATH_LINE_OF_POOL
};
module.exports = exports["default"];

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ofRandomInt = ofRandomInt;

function ofRandomInt(num) {
  return Math.random() * (num + 1) | 0;
}

},{}],27:[function(require,module,exports){
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

  var timerId = 0;
  var startTime = 0;
  var vue = new global.Vue({
    el: "#app",
    data: {
      isPlaying: false,
      elapsed: ""
    },
    methods: {
      soundOn: function soundOn() {
        var _this = this;

        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
          app.start();
          startTime = Date.now();
          timerId = setInterval(function () {
            var elapsed = Date.now() - startTime;
            var msec = elapsed % 1000;
            var seconds = Math.floor(elapsed / 1000) % 60;
            var minutes = Math.floor(elapsed / 1000 / 60);

            _this.elapsed = minutes + ":" + seconds + "." + msec;
          }, 250);
        } else {
          app.stop();
          clearInterval(timerId);
        }
      },
      addMobile: function addMobile() {
        app.addMobile();
      },
      removeMobile: function removeMobile() {
        app.removeMobile();
      }
    }
  });
};

exports["default"] = {};
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":20,"./app/ModelView":17,"./model/Model":24,"@mohayonao/web-audio-utils/enableMobileAutoPlay":12,"@mohayonao/web-audio-utils/getAudioContext":14}]},{},[27]);
