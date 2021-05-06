"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const node_html_parser_1 = require("node-html-parser");
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const events_1 = require("events");
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const aigle_1 = require("aigle");
const axios_retry_1 = __importDefault(require("axios-retry"));
const Episodes_1 = require("./Episodes");
axios_retry_1.default(axios_1.default, {
    retries: 3,
});
const events = new events_1.EventEmitter();
class Base {
    constructor(options) {
        if (options) {
            this._catch = options.catch || false;
        }
        this.on = events.on;
        this.once = events.once;
        this._emit = events.emit;
    }
    /** @protected */
    episodes(anime, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = lodash_1.default.merge({}, options);
            try {
                if (options.episodes && Number(options.episodes) !== 0) {
                    anime.hrefs = this.filter_eps(anime, options);
                }
                const href_data = yield this.hrefsData(anime.hrefs);
                const results = lodash_1.default.merge(anime, {
                    eps: href_data.length,
                    data: href_data,
                });
                if (anime.type === 'Movie') {
                    lodash_1.default.unset(results, 'eps');
                }
                lodash_1.default.unset(results, 'hrefs');
                return new Episodes_1.EpisodesData(results);
            }
            catch (e) {
                if (this._catch) {
                    throw e;
                }
                else {
                    this._emit('error', e);
                    return null;
                }
            }
        });
    }
    /** @protected */
    hrefsData(hrefs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const async_handler = (e) => __awaiter(this, void 0, void 0, function* () {
                    const _url = new url_1.URL(e.href);
                    const _anime = yield axios_1.default.get(e.href);
                    const document = node_html_parser_1.parse(_anime.data);
                    const id = Number(_url.searchParams.get('id'));
                    const src = document
                        .querySelector('video#example_video_1 source')
                        .getAttribute('src');
                    const filename = path_1.default.basename(src);
                    const ep = Number(document.querySelector('.episodes.range.active .active')
                        .textContent);
                    this._emit('loaded', e.ep, hrefs.length);
                    return {
                        ep,
                        id,
                        src,
                        filename,
                    };
                });
                const results = yield aigle_1.Aigle.resolve(hrefs).map(async_handler);
                return results;
            }
            catch (e) {
                if (this._catch) {
                    throw e;
                }
                else {
                    this._emit('error', e);
                    return null;
                }
            }
        });
    }
    /** @protected */
    _search(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const _name = item.querySelector('.name');
            const _meta = item.querySelectorAll('.meta .yearzi');
            const main = _name.getAttribute('href');
            const title = _name.textContent;
            const type = _meta[0].textContent;
            const year = _meta[1].textContent;
            const genres = item
                .querySelectorAll('.genre a')
                .map(a => a.textContent);
            const anime = node_html_parser_1.parse((yield axios_1.default.get(main)).data);
            const hrefs = anime
                .querySelectorAll('ul.episodes a')
                .map(a => ({
                href: a.getAttribute('href'),
                ep: Number(a.textContent),
            }))
                .sort((a, b) => a.ep - b.ep);
            const status = anime
                .querySelectorAll('.details .detail')[3]
                .querySelector('a').textContent;
            const props = {
                title,
                main,
                type,
                year,
                genres,
                hrefs,
                status,
            };
            return props;
        });
    }
    /**
     * @protected
     * @beta
     */
    filter_eps(anime, options) {
        let filth = options.episodes;
        const testReg = /(-\s+)?(\d+,?\s?)+/g;
        const rangeReg = /\d+-\d+/g;
        if (filth.match(testReg)) {
            const ranges = lodash_1.default.chain(filth.match(rangeReg).map(v => {
                let [a, b] = v.split('-').map(Number);
                let range;
                if (lodash_1.default.gt(a, b)) {
                    if (a > anime.hrefs.length) {
                        a = anime.hrefs.length;
                    }
                    range = lodash_1.default.range(b, a + 1);
                }
                else {
                    if (b > anime.hrefs.length) {
                        b = anime.hrefs.length;
                    }
                    range = lodash_1.default.range(a, b + 1);
                }
                return range;
            }))
                .flattenDeep()
                .uniq()
                .value();
            filth = filth
                .replace(/,+/g, ' ')
                .replace(/\s+/g, ' ')
                .split(' ')
                .map(v => {
                if (Math.abs(v)) {
                    return Math.abs(v);
                }
                return v;
            })
                .filter((v, k) => {
                if (k === 0) {
                    if (v === '-' || lodash_1.default.isNumber(v)) {
                        return true;
                    }
                    return false;
                }
                if (lodash_1.default.isNumber(v)) {
                    return true;
                }
                return false;
            });
            filth = lodash_1.default.sortBy(lodash_1.default.concat(filth, ranges).filter(Boolean));
            if (filth[0] === '-') {
                lodash_1.default.remove(anime.hrefs, val => filth.includes(val.ep));
            }
            else {
                lodash_1.default.remove(anime.hrefs, val => !filth.includes(val.ep));
            }
            return anime.hrefs;
        }
    }
}
exports.Base = Base;
