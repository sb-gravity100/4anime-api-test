"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.term = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const nhp = __importStar(require("node-html-parser"));
const aigle_1 = require("aigle");
const axios_retry_1 = __importDefault(require("axios-retry"));
const classes_1 = require("./classes");
axios_retry_1.default(axios_1.default, {
    retries: 3,
});
const parse = nhp.parse;
async function _search(item) {
    const _name = item.querySelector('.name');
    const _meta = item.querySelectorAll('.meta .yearzi');
    const main = _name.getAttribute('href');
    const title = _name.textContent;
    const type = _meta[0].textContent;
    const year = _meta[1].textContent;
    const genres = item
        .querySelectorAll('.genre a')
        .map(a => a.textContent);
    const anime = parse((await axios_1.default.get(main)).data);
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
    return new classes_1.SearchResult(props);
}
/**
 * Search an anime by a term.
 * @param {string} s - string to search for.
 * @returns {ISearchResult[]} An array of search results.
 * @example
 * ```typescript
 * Anime.on('error', console.log) // Catch errors
 * Anime.term('jujutsu kaisen').then(res => {
 *   // Do something with res
 * })
 * ```
 */
async function term(s) {
    const url = 'https://4anime.to/wp-admin/admin-ajax.php';
    const data = querystring_1.default.stringify({
        action: 'ajaxsearchlite_search',
        aslp: s,
        options: 'qtranslate_lang=0&set_intitle=None&customset%5B%5D=anime',
    });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: 'https://4anime.to',
            Origin: 'https://4anime.to',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        },
        responseType: 'text',
    };
    const search = await axios_1.default.post(url, data, options);
    const root = parse(search.data);
    if (root.querySelector('.asl_nores_header')) {
        throw {
            name: 'Error',
            code: 'ANIMENOTFOUND',
            message: 'Anime not found',
        };
    }
    const items = root.querySelectorAll('.item');
    const results = await aigle_1.Aigle.resolve(items).map(e => _search(e));
    return results;
}
exports.term = term;
