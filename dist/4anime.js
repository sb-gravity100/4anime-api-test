"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FourAnime = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _jsdom = require("jsdom");

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FourAnime extends _events.EventEmitter {
  constructor(options) {
    super({
      captureRejections: true
    });

    _defineProperty(this, "options", void 0);

    this.options = options;
  }

  async term(s, cb) {
    let results;

    try {
      const search = await _axios.default.get('https://4anime.to', {
        method: 'GET',
        params: {
          s
        }
      });
      const {
        document
      } = new _jsdom.JSDOM(search.data).window;

      if (cb) {
        cb(results);
        return;
      } else {
        return results;
      }
    } catch (e) {
      if (this.options.catch) {
        throw e;
      } else {
        this.emit('error', e);
        return;
      }
    }
  }

}

exports.FourAnime = FourAnime;