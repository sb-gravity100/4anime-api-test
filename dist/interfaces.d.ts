/** 'Completed' | 'Currently Airing' */
export declare type TAnimeStatus = 'Completed' | 'Currently Airing' | string;
/** 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA' */
export declare type TAnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA' | string;
export declare type TonEvent = (event: string | symbol, listener: (...args: any[]) => void) => void;
export declare type TClassEvents = 'error' | 'loaded';
export declare type TemitEvent = (event: string | symbol, ...args: any[]) => void;
export declare type TSearchProperties = 'title' | 'main' | 'type' | 'year' | 'genres' | 'href' | 'status';
/** Search data */
export interface ISearchResult {
    /** Title of the anime. */
    readonly title: string;
    /** Main page. */
    readonly main: string;
    /** @see TAnimeType */
    readonly type: TAnimeType;
    /** Year aired. */
    readonly year: string;
    /** An array of genres. */
    readonly genres: string[];
    /** An array of episode links. */
    readonly hrefs: IEpisodeHrefs[];
    /** @see TAnimeStatus */
    readonly status: TAnimeStatus;
    getAnime(options?: IEpisodeOptions): Promise<IAnimeData | void>;
    toJSON(): ISearchJSON;
}
export interface ISearchJSON {
    /** Title of the anime. */
    title: string;
    /** Main page. */
    main: string;
    /** @see TAnimeType */
    type: TAnimeType;
    /** Year aired. */
    year: string;
    /** An array of genres. */
    genres: string[];
    /** An array of episode links. */
    hrefs: IEpisodeHrefs[];
    /** @see TAnimeStatus */
    status: TAnimeStatus;
}
export interface IEpisodeHrefs {
    /** Link to an episode. */
    href: string;
    /** Episode number */
    ep: number;
}
/** Data of every episode */
export interface IAnimeEpisode {
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
export interface IAnimeDataJSON {
    /** @see {@link SearchResult.title} */
    title: string;
    /** Number of episodes. */
    eps: number;
    /** @see TAnimeType */
    type: TAnimeType;
    /** @see TAnimeStatus */
    status: TAnimeStatus;
    /** An array of genres. */
    genres: string[];
    /** @see {@link SearchResult.year} */
    year: string;
    /**
     * Episode data.
     * @see {@link IAnimeEpisode}
     */
    data: IAnimeEpisode[];
}
export interface IAnimeData {
    getEpisodes(): IAnimeEpisode[];
    toJSON(): IAnimeDataJSON;
}
export interface IEpisodeOptions {
    episodes?: string;
}
/** Instance options */
export interface IAnimeOptions {
    /**  Set to true if you want all errors to be thrown in a catch block. */
    catch?: boolean;
}
/** Interface of the FourAnime class. */
export interface I4Anime {
    term(s: string): Promise<ISearchResult[]>;
}
export interface IBase {
    on: TonEvent;
    once: TonEvent;
    episodes(a: ISearchJSON, options?: IEpisodeOptions): Promise<IAnimeDataJSON>;
}
