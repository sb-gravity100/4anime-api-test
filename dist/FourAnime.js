"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourAnime = void 0;
var axios_1 = __importDefault(require("axios"));
var jsdom_1 = require("jsdom");
var events_1 = require("events");
var url_1 = require("url");
var path_1 = __importDefault(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var aigle_1 = require("aigle");
var axios_retry_1 = __importDefault(require("axios-retry"));
axios_retry_1.default(axios_1.default, {
    retries: 3
});
/**
 * Represents the class for getting links from 4Anime.to.
 * @class FourAnime - Represents the class for getting links from 4Anime.to.
 * @extends EventEmitter
 */
var FourAnime = /** @class */ (function (_super) {
    __extends(FourAnime, _super);
    /**
     * Creates a new FourAnime instance.
     * @param {Object} [FourAnimeOptions] - options.
     * @param {boolean} [FourAnimeOptions.catch] - throw all errors in a catch block if true. Otherwise it emits an error event.
     * @example
     * const Anime = new FourAnime({
     *    catch: false, // default
     * })
     */
    function FourAnime(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, { captureRejections: true }) || this;
        _this.catch = options.catch || false;
        return _this;
    }
    /**
     * Callback for term.
     * @callback searchCallback
     * @param {object[] | void} SearchResult
     */
    /**
     * Search an anime by a term.
     * @param {string} s - string to search for.
     * @param {searchCallback} [cb] - optional callback.
     * @returns {object[] | void} An array of search results.
     * @example
     * Anime.term('jujutsu kaisen', results => {
     *   // Do something with it...
     * })
     */
    FourAnime.prototype.term = function (s, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var results, search, document, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://4anime.to', {
                                method: 'GET',
                                params: { s: s },
                            })];
                    case 1:
                        search = _b.sent();
                        document = new jsdom_1.JSDOM(search.data).window.document;
                        _a = Array.from(document.querySelectorAll('div#headerDIV_95 a'), function (a) {
                            var text = a.textContent
                                .trim()
                                .replace(/\/\n/gi, '')
                                .replace(/\/\n/gi, '')
                                .split('\n');
                            text.splice(2, 1, a.href);
                            var _r = lodash_1.default.zipObject(['title', 'year', 'link', 'status'], text);
                            if (_r.title.length > 75) {
                                _r.title += '...';
                            }
                            return _r;
                        });
                        if (_a.length < 1) {
                            throw {
                                name: 'Error',
                                code: 'ANINOTFOUND',
                                message: 'Anime not found',
                            };
                        }
                        results = _a;
                        if (cb) {
                            cb(results);
                        }
                        else {
                            return [2 /*return*/, results];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        if (this.catch) {
                            throw e_1;
                        }
                        else {
                            this.emit('error', e_1);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Callback for episodes.
     * @callback episodesCallback
     * @param {object | void} AnimeData
     */
    /**
     * Get anime data and episode links.
     * @param {object} a - an object from the search results.
     * @param {episodesCallback} [cb] - optional callback.
     * @returns {object[] | void} An array of search results.
     * @see FourAnime#term
     * @example
     * const search = await Anime.term('jujutsu kaisen')
     * Anime.episodes(search[0], results => {
     *   // Do something with the results...
     * })
     */
    FourAnime.prototype.episodes = function (a, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var results, anime, document, arr_href, type, title, href_data, all_data, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, axios_1.default({
                                method: 'GET',
                                url: a.link,
                            })];
                    case 1:
                        anime = _b.sent();
                        document = new jsdom_1.JSDOM(anime.data).window.document;
                        arr_href = Array.from(document.querySelectorAll('ul.episodes.range.active a'), function (link) { return new url_1.URL(link.href); });
                        type = document.querySelector('.details .detail a')
                            .textContent;
                        title = document.querySelector('.single-anime-desktop')
                            .textContent;
                        return [4 /*yield*/, this.hrefsData(arr_href)];
                    case 2:
                        href_data = _b.sent();
                        all_data = {
                            title: title,
                            type: type,
                            status: a.status,
                            year: a.year,
                            eps: arr_href.length,
                            data: href_data,
                        };
                        if (type === 'Movie') {
                            lodash_1.default.unset(all_data, 'eps');
                        }
                        results = all_data;
                        if (cb) {
                            cb(results);
                        }
                        else {
                            return [2 /*return*/, results];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        if (this.catch) {
                            throw e_2;
                        }
                        else {
                            this.emit('error', e_2);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FourAnime.prototype.hrefsData = function (href) {
        return __awaiter(this, void 0, void 0, function () {
            var results, qLength, async_handler, anime_data, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        qLength = 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        async_handler = function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var _anime, document, ep, id, src, filename;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, axios_1.default.get(e.href)];
                                    case 1:
                                        _anime = _b.sent();
                                        document = new jsdom_1.JSDOM(_anime.data).window.document;
                                        ep = Number(e.pathname.split('-').pop()) || 1;
                                        id = Number(e.searchParams.get('id'));
                                        src = document.querySelector('video#example_video_1 source').src;
                                        filename = path_1.default.basename(src);
                                        qLength++;
                                        this.emit('loaded', qLength, href.length);
                                        return [2 /*return*/, {
                                                ep: ep,
                                                id: id,
                                                src: src,
                                                filename: filename,
                                            }];
                                }
                            });
                        }); };
                        return [4 /*yield*/, aigle_1.Aigle.resolve(href).map(async_handler)];
                    case 2:
                        anime_data = _b.sent();
                        // .sortBy(d => d.ep);
                        results = anime_data;
                        return [2 /*return*/, results];
                    case 3:
                        e_3 = _b.sent();
                        if (this.catch) {
                            throw e_3;
                        }
                        else {
                            this.emit('error', e_3);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FourAnime;
}(events_1.EventEmitter));
exports.FourAnime = FourAnime;
//# sourceMappingURL=FourAnime.js.map