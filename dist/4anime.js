"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FourAnime = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _jsdom = require("jsdom");

var _events = require("events");

var _url = require("url");

var _lodash = _interopRequireDefault(require("lodash"));

var _aigle = require("aigle");

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

      const _a = Array.from(document.querySelectorAll('div#headerDIV_95 a'), a => {
        const text = a.textContent.trim().replace(/\/\n/gi, '').replace(/\/\n/gi, '').split('\n');
        text.splice(2, 1, a.href);

        const _r = _lodash.default.zipObject(['title', 'year', 'link', 'status'], text);

        return _r;
      });

      if (_a.length < 1) {
        throw {
          name: 'Error',
          code: 'ANINOTFOUND',
          message: 'Anime not found'
        };
      }

      results = _a;

      if (cb) {
        cb(results);
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

  async episodes(a, cb) {
    let results;

    try {
      const anime = await (0, _axios.default)({
        method: 'GET',
        url: a
      });
      const {
        document
      } = new _jsdom.JSDOM(anime.data).window;
      const arr_href = Array.from(document.querySelectorAll('ul.episodes.range.active a'), link => new _url.URL(link.href));
      const href_data = await this.hrefsData(arr_href);
      results = href_data;

      if (cb) {
        cb(results);
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

  async hrefsData(href, cb) {
    let results,
        qLength = 0;

    try {
      const async_handler = async e => {
        const _anime = await _axios.default.get(e.href);

        if (qLength === 1) {
          require('fs').writeFileSync('./index.html', _anime.data);
        }

        const {
          document
        } = new _jsdom.JSDOM(_anime.data, {
          url: e.href,
          runScripts: 'dangerously',
          resources: 'usable',
          contentType: 'text/html',
          includeNodeLocations: true
        }).window;
        const ep = parseInt(e.pathname.split('-').pop());
        const id = e.searchParams.get('id').toString();
        const title = Array.from(document.querySelectorAll('.singletitletop #titleleft'), t => t.textContent).join(' ');
        const src = document.querySelectorAll('video#example_video_1 source');
        qLength++;
        this.emit('loaded', qLength, href.length);
        return {
          ep,
          id,
          title,
          src
        };
      };

      const anime_data = await _aigle.Aigle.resolve(href).map(async_handler).sortBy(d => d.ep);
      results = anime_data;
      console.log('Returning shit');

      if (cb) {
        cb(results);
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