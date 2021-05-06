import { Base } from './classes';
import { I4Anime, IAnimeOptions, ISearchResult } from './interfaces';
/** Represents the class for getting links from 4Anime.to. */
export declare class FourAnime extends Base implements I4Anime {
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
    constructor(options?: IAnimeOptions);
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
    term(s: string): Promise<ISearchResult[]>;
}
