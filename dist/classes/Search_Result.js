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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const Base_1 = require("./Base");
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
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.episodes(this.toJSON(), options);
        });
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
