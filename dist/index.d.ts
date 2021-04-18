/// <reference types="node" />
declare module "4anime" {
    import { EventEmitter } from 'events';
    type AnimeStatus = 'Completed' | 'Currently Airing';
    type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
    export interface SearchResult {
        title?: string;
        link: string;
        year?: string;
        status?: AnimeStatus;
    }
    export interface AnimeEpisode {
        src: string;
        ep: number;
        filename: string;
        id: number;
    }
    export interface AnimeData {
        title?: string;
        eps?: number;
        type?: AnimeType;
        status?: AnimeStatus;
        year?: string;
        data: Array<AnimeEpisode>;
    }
    export interface AnimeOptions {
        catch?: boolean;
    }
    export interface $4Anime {
        term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | void>;
        episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
    }
    /**
     * Represents the class for getting links from 4Anime.to.
     * @class FourAnime - Represents the class for getting links from 4Anime.to.
     * @extends EventEmitter
     */
    export class FourAnime extends EventEmitter implements $4Anime {
        /**
         * @private
         */
        private catch?;
        /**
         * Creates a new FourAnime instance.
         * @param {Object} [FourAnimeOptions] - options.
         * @param {boolean} [FourAnimeOptions.catch] - throw all errors in a catch block if true. Otherwise it emits an error event.
         * @example
         * const Anime = new FourAnime({
         *    catch: false, // default
         * })
         */
        constructor(options?: AnimeOptions);
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
        term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | undefined>;
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
        episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
        private hrefsData;
    }
}
