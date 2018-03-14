'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unfetch = require('unfetch');

var _unfetch2 = _interopRequireDefault(_unfetch);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TRANSFORM = function TRANSFORM(data) {
  return data;
};

var StreamCore = function () {
  function StreamCore() {
    _classCallCheck(this, StreamCore);

    this.engine = {
      http: _unfetch2.default,
      ws: WebSocket
    };
    this.config = {};
    this.hooks = {};
    this.times = -1;
    this._reconnectionAttempts = 0;
  }

  _createClass(StreamCore, [{
    key: 'request',
    value: function request(url, options) {
      this.config.url = url;
      this.config.options = options;

      return this;
    }
  }, {
    key: 'get',
    value: function get(url, options) {
      this.config.method = 'GET';

      return this.request(url, options);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.config.method = 'POST';

      return this.request(url, {
        headers: _extends({
          'Content-Type': 'application/json'
        }, headers),
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'put',
    value: function put(url) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.config.method = 'PUT';

      return this.request(url, {
        headers: _extends({
          'Content-Type': 'application/json'
        }, headers),
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'patch',
    value: function patch(url) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.config.method = 'PATCH';

      return this.request(url, {
        headers: _extends({
          'Content-Type': 'application/json'
        }, headers),
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'delete',
    value: function _delete(url) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.config.method = 'DELETE';

      return this.request(url, {
        headers: _extends({
          'Content-Type': 'application/json'
        }, headers),
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'interval',
    value: function interval(ms) {
      this.config.interval = ms;
      return this;
    }
  }, {
    key: 'times',
    value: function times(_times) {
      this.times = _times;
      return this;
    }
  }, {
    key: 'websocket',
    value: function websocket(websocketURL) {
      var websocketOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.config.websocketURL = websocketURL;
      this.config.websocketOptions = websocketOptions;
      return this;
    }
  }, {
    key: 'engine',
    value: function engine(_engine) {
      this.config.engine = _extends({}, this.config.engine, _engine);
      return this;
    }
  }, {
    key: 'transform',
    value: function transform() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TRANSFORM;

      this.hooks.transform = cb;
      return this;
    }
  }, {
    key: 'on',
    value: function on(cb) {
      this.hooks.on = cb;
      return this;
    }
  }, {
    key: 'once',
    value: function once(cb) {
      this.hooks.once = cb;
      return this;
    }
  }, {
    key: 'error',
    value: function error(cb) {
      this.hooks.error = cb;
      return this;
    }
  }, {
    key: 'off',
    value: function off() {
      utils.clearInterval(this.intervalFn);

      return this;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this = this;

      var ws = new this.engine.ws(this.config.websocketURL); // eslint-disable-line
      var _config$websocketOpti = this.config.websocketOptions,
          _config$websocketOpti2 = _config$websocketOpti.reconnection,
          reconnection = _config$websocketOpti2 === undefined ? true : _config$websocketOpti2,
          _config$websocketOpti3 = _config$websocketOpti.reconnectionDelay,
          reconnectionDelay = _config$websocketOpti3 === undefined ? 10000 : _config$websocketOpti3,
          _config$websocketOpti4 = _config$websocketOpti.reconnectionAttempts,
          reconnectionAttempts = _config$websocketOpti4 === undefined ? Infinity : _config$websocketOpti4;


      ws.onmessage = this.hooks.on;
      ws.onerror = this.hooks.error;
      ws.onclose = function () {
        _this.hooks.close && _this.hooks.close();

        if (reconnection === true) {
          setTimeout(function () {
            if (_this._reconnectionAttempts < reconnectionAttempts) {
              _this.connect();
            }
          }, reconnectionDelay);
        }
      };

      this._reconnectionAttempts += 1;
    }
  }, {
    key: 'flow',
    value: function flow() {
      var _this2 = this;

      var options = _extends({
        method: this.config.method
      }, this.config.options);

      if (this.config.websocketURL) {
        this.connect(this.config.websocketURL);
      } else if (this.hooks.on) {
        // start right now
        this.engine.http(this.config.url, options).then(this.hooks.on).catch(this.hooks.error);

        if (this.times <= 0) {
          this.intervalFn = setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var data;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return _this2.engine.http(_this2.config.url, options);

                  case 3:
                    data = _context.sent;

                    _this2.hooks.on(_this2.hooks.transform(data));
                    _context.next = 10;
                    break;

                  case 7:
                    _context.prev = 7;
                    _context.t0 = _context['catch'](0);

                    _this2.hooks.error(_context.t0);

                  case 10:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2, [[0, 7]]);
          })), this.config.interval);
        } else {
          var times = 0;
          this.intervalFn = setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var data;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    times += 1;

                    if (!(_this2.times < times)) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.abrupt('return', _this2.off());

                  case 3:
                    _context2.prev = 3;
                    _context2.next = 6;
                    return _this2.engine.http(_this2.config.url, options);

                  case 6:
                    data = _context2.sent;

                    _this2.hooks.on(_this2.hooks.transform(data));
                    _context2.next = 13;
                    break;

                  case 10:
                    _context2.prev = 10;
                    _context2.t0 = _context2['catch'](3);

                    _this2.hooks.error(_context2.t0);

                  case 13:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this2, [[3, 10]]);
          })), this.config.interval);
        }
      } else if (this.hooks.once) {
        this.engine.http(this.config.url, options).then(function (data) {
          return _this2.hooks.once(_this2.hooks.transform(data));
        }).catch(this.hooks.error);
      } else {
        throw new Error('invalid on / once');
      }
    }
  }, {
    key: 'run',
    value: function run() {
      this.flow();

      return this;
    }
  }]);

  return StreamCore;
}();

exports.default = StreamCore;