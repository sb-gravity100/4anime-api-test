"use strict";
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
// import fs from 'fs';
const axios_retry_1 = __importDefault(require("axios-retry"));
const Episodes_1 = require("./Episodes");
axios_retry_1.default(axios_1.default, {
    retries: 3,
});
class Base extends events_1.EventEmitter {
    constructor() {
        super();
    }
    /** @protected */
    async episodes(anime, options) {
        options = lodash_1.default.merge({}, options);
        try {
            if (options.episodes && Number(options.episodes) !== 0) {
                anime.hrefs = this.filter_eps(anime, options);
            }
            const href_data = await this.hrefsData(anime.hrefs);
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
                this.emit('error', e);
                return null;
            }
        }
    }
    /** @protected */
    async hrefsData(hrefs) {
        try {
            const async_handler = async (e) => {
                const _url = new url_1.URL(e.href);
                const _anime = await axios_1.default.get(e.href);
                const document = node_html_parser_1.parse(_anime.data);
                const id = Number(_url.searchParams.get('id'));
                const src = document
                    .querySelector('video#example_video_1 source')
                    .getAttribute('src');
                const filename = path_1.default.basename(src);
                const ep = Number(document.querySelector('.episodes.range.active .active')
                    .textContent);
                this.emit('loaded', e.ep, hrefs.length);
                return {
                    ep,
                    id,
                    src,
                    filename,
                };
            };
            const results = await aigle_1.Aigle.resolve(hrefs).map(async_handler);
            return results;
        }
        catch (e) {
            if (this._catch) {
                throw e;
            }
            else {
                this.emit('error', e);
                return null;
            }
        }
    }
    /**
     * @protected
     * @beta
     */
    filter_eps(anime, options) {
        let filth = options.episodes;
        const testReg = /(-\s*)?(\d+,*\s*)+/g;
        const rangeReg = /\d+-\d+/g;
        if (!options.episodes) {
            return anime.hrefs;
        }
        if (filth.match(testReg)) {
            const ranges = lodash_1.default.chain(filth.match(rangeReg).map((v) => {
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
                .map((v) => {
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
