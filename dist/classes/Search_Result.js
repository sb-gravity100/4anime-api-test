"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const Base_1 = require("./Base");
/**
 * A search result instance
 */
class SearchResult extends Base_1.Base {
    constructor(props) {
        super();
        for (let x in props) {
            this[`${x}`] = props[x];
        }
    }
    /**
     * Fetch anime data.
     * @param {IEpisodeOptions} [options] - pass options.
     * @returns {Promise<IAnimeData>} a promise
     */
    getAnime(options) {
        return this.episodes(this.get(), options);
    }
    get() {
        const __s_r = {
            title: this.title,
            main: this.main,
            type: this.type,
            year: this.year,
            genres: this.genres,
            hrefs: this.hrefs,
            status: this.status,
        };
        return __s_r;
    }
    toJSON() {
        const __s_r = {
            title: this.title,
            main: this.main,
            type: this.type,
            year: this.year,
            genres: this.genres,
            hrefs: this.hrefs,
            status: this.status,
        };
        return __s_r;
    }
}
exports.SearchResult = SearchResult;
