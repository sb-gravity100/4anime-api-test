import 'core-js';
declare type AnimeStatus = 'Completed' | 'Currently Airing';
declare type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
declare type onEvent = (event: string | symbol, listener: (...args: any[]) => void) => void;
declare type emitEvent = (event: string | symbol, ...args: any[]) => void;
/** Search data */
export interface SearchResult {
    /** Title of the anime. */
    title?: string;
    /** Url to the anime in 4anime.to */
    link: string;
    /** Year aired. */
    year?: string;
    /** 'Completed' or 'Currently Airing'. */
    status?: AnimeStatus;
}
/** Data of every episode */
export interface AnimeEpisode {
    /** Url of the source. */
    src: string;
    /** Episode number. */
    ep: number;
    /** Filename */
    filename: string;
    /** Anime id based on 4anime.to */
    id: number;
}
/** Data scraped from 4anime */
export interface AnimeData {
    /** @see {@link SearchResult.title} */
    title?: string;
    /** Number of episodes. */
    eps?: number;
    /** Type of anime...(eg. 'Movie', 'TV Series', 'OVA'...). */
    type?: AnimeType;
    /** @see {@link SearchResult.status} */
    status?: AnimeStatus;
    /** @see {@link SearchResult.year} */
    year?: string;
    /**
     * Episode data.
     * @see {@link AnimeEpisode}
     */
    data: AnimeEpisode[];
}
/** Instance options */
export interface AnimeOptions {
    /**  Set to true if you want all errors to be thrown in a catch block. */
    catch?: boolean;
}
/** Interface of the FourAnime class. */
export interface $4Anime {
    on: onEvent;
    once: onEvent;
    term(s: string, cb: (s: SearchResult[]) => void): Promise<SearchResult[] | void>;
    episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
}
/** Represents the class for getting links from 4Anime.to. */
export declare class FourAnime implements $4Anime {
    /**
     * @defaultValue false
     * @readonly
     */
    catch?: boolean;
    /**
     * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_on_eventname_listener}
     */
    on: onEvent;
    /**
     * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_once_eventname_listener}
     */
    once: onEvent;
    /**
     * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_emit_eventname_args}
     */
    protected emit: emitEvent;
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
     * ```typescript
     * Anime.term('jujutsu kaisen', results => {
     *   // Do something with it...
     * })
     * ```
     */
    term(s: string, cb: (s: SearchResult[]) => void): Promise<SearchResult[] | undefined>;
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
     * @see {@link FourAnime.term}
     * @example
     * ```typescript
     * const search = await Anime.term('jujutsu kaisen')
     * Anime.episodes(search[0], results => {
     *   // Do something with the results...
     * })
     * ```
     */
    episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
    /** @private */
    private hrefsData;
}
export {};
