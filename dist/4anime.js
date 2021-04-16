"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FourAnime = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _jsdom = require("jsdom");

var _events = require("events");

var _url = require("url");

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _aigle = require("aigle");

var _axiosRetry = _interopRequireDefault(require("axios-retry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _axiosRetry.default)(_axios.default, {
  retries: 3
});

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

        if (_r.title.length > 75) {
          _r.title += '...';
        }

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
        url: a.link
      });
      const {
        document
      } = new _jsdom.JSDOM(anime.data).window;
      const arr_href = Array.from(document.querySelectorAll('ul.episodes.range.active a'), link => new _url.URL(link.href));
      const type = document.querySelector('.details .detail a').textContent;
      const title = document.querySelector('.single-anime-desktop').textContent;
      const href_data = await this.hrefsData(arr_href);
      const all_data = {
        title: title,
        type: type,
        status: a.status,
        year: a.year,
        eps: arr_href.length,
        data: href_data
      };

      if (type === 'Movie') {
        _lodash.default.unset(all_data, 'eps');
      }

      results = all_data;

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

        const {
          document
        } = new _jsdom.JSDOM(_anime.data).window;
        const ep = parseInt(e.pathname.split('-').pop()) || 1;
        const id = e.searchParams.get('id').toString();
        const src = document.querySelector('video#example_video_1 source').src;

        const filename = _path.default.basename(src);

        qLength++;
        this.emit('loaded', qLength, href.length);
        return {
          ep,
          id,
          src,
          filename
        };
      };

      const anime_data = await _aigle.Aigle.resolve(href).map(async_handler);
      results = anime_data;

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