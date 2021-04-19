import 'core-js';
declare type AnimeStatus = 'Completed' | 'Currently Airing';
declare type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
declare type onEvent = (event: string | symbol, listener: (...args: any[]) => void) => void;
/** Search data */
export interface SearchResult {
    /** Title of the anime. */
    title?: string;
    /** Url to the anime in simply.moe */
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
    /** Anime id based on simply.moe */
    id: number;
}
/** Data scraped from simply.moe */
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
export interface SimplyClass {
    on: onEvent;
    once: onEvent;
    term(s: string, cb: (s: SearchResult[]) => void): Promise<SearchResult[] | void>;
    episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
}
export declare class SimplyMoe implements SimplyClass {
    constructor();
}
export {};
