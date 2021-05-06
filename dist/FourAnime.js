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
exports.FourAnime = void 0;
const axios_1 = __importDefault(require("axios"));
const nhp = __importStar(require("node-html-parser"));
const aigle_1 = require("aigle");
const axios_retry_1 = __importDefault(require("axios-retry"));
const form_data_1 = __importDefault(require("form-data"));
const classes_1 = require("./classes");
axios_retry_1.default(axios_1.default, {
    retries: 3,
});
const parse = nhp.parse;
/** Represents the class for getting links from 4Anime.to. */
class FourAnime extends classes_1.Base {
    /**
     * Creates a new FourAnime instance.
     * @param {Object} [FourAnimeOptions] - options.
     * @param {boolean} [FourAnimeOptions.catch] - throw all errors in a catch block if true. Otherwise it emits an error event.
     * @example
     * ```typescript
     * const Anime = new FourAnime({
     *    catch: false, // default
     * })
     * ```
     */
    constructor(options) {
        super(options);
    }
    /**
     * Search an anime by a term.
     * @param {string} s - string to search for.
     * @param {searchCallback} [cb] - optional callback.
     * @returns {ISearchResult[]} An array of search results.
     * @example
     * ```typescript
     * Anime.on('error', console.log) // Catch errors
     * Anime.term('jujutsu kaisen').then(res => {
     *   // Do something with res
     * })
     * ```
     */
    term(s) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const form = new form_data_1.default();
                form.append('action', 'ajaxsearchlite_search');
                form.append('aslp', s);
                form.append('options', 'qtranslate_lang=0&set_intitle=None&customset%5B%5D=anime');
                const headers = form.getHeaders();
                const search = yield axios_1.default.post('https://4anime.to/wp-admin/admin-ajax.php', form.getBuffer(), {
                    headers: Object.assign(Object.assign({}, headers), { Referer: 'https://4anime.to', Origin: 'https://4anime.to', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246' }),
                });
                const root = parse(search.data.toString());
                if (root.querySelector('.asl_nores_header')) {
                    throw {
                        name: 'Error',
                        code: 'ANINOTFOUND',
                        message: 'Anime not found',
                    };
                }
                const items = root.querySelectorAll('.item');
                const results = yield aigle_1.Aigle.resolve(items).map(this._search);
                return results.map(_a => new classes_1.SearchResult(_a));
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
}
exports.FourAnime = FourAnime;
