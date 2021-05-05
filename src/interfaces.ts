/** 'Completed' | 'Currently Airing' */
export type TAnimeStatus = 'Completed' | 'Currently Airing' | string;
/** 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA' */
export type TAnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA' | string;
export type TonEvent = (
   event: string | symbol,
   listener: (...args: any[]) => void
) => void;
export type TClassEvents = 'error'|'loaded'
export type TemitEvent = (event: string | symbol, ...args: any[]) => void;

/** Search data */
export interface ISearchResult {
   /** Title of the anime. */
   title: string;
   /** Main page. */
   main: string;
   /** @see TAnimeType */
   type?: TAnimeType;
   /** Year aired. */
   year?: string;
   /** An array of genres. */
   genres?: string[];
   /** An array of episode links. */
   hrefs: IEpisodeHrefs[];
   /** @see TAnimeStatus */
   status?: TAnimeStatus;
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
export interface IAnimeData {
   /** @see {@link SearchResult.title} */
   title?: string;
   /** Number of episodes. */
   eps?: number;
   /** @see TAnimeType */
   type?: TAnimeType;
   /** @see TAnimeStatus */
   status?: TAnimeStatus;
   /** An array of genres. */
   genres?: string[];
   /** @see {@link SearchResult.year} */
   year?: string;
   /**
    * Episode data.
    * @see {@link IAnimeEpisode}
    */
   data: IAnimeEpisode[];
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
   on: TonEvent;
   once: TonEvent;
   term(
      s: string,
      cb: (s: ISearchResult[]) => void
   ): Promise<ISearchResult[] | void>;
   episodes(
      a: ISearchResult,
      options?: IEpisodeOptions,
      cb?: (results: IAnimeData | void) => void
   ): Promise<IAnimeData | void>;
}
