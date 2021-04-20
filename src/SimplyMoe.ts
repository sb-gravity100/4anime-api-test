import 'core-js';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 3,
});

const events = new EventEmitter();

type AnimeStatus = 'Completed' | 'Currently Airing';
type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
type onEvent = (
  event: string | symbol,
  listener: (...args: any[]) => void
) => void;
type emitEvent = (event: string | symbol, ...args: any[]) => void;

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
  catch?: boolean;
  term(
    s: string,
    cb: (s: SearchResult[]) => void
  ): Promise<SearchResult[] | void>;
  episodes(
    a: SearchResult,
    cb?: (results: AnimeData | void) => void
  ): Promise<AnimeData | void>;
}

export class SimplyMoe implements SimplyClass {
  /**
   * @defaultValue false
   * @readonly
   */
  public catch?: boolean;
  /**
   * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_on_eventname_listener}
   */
  public on: onEvent;
  /**
   * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_once_eventname_listener}
   */
  public once: onEvent;
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
  constructor(options: AnimeOptions = {}) {
    this.catch = options.catch || false;
    this.on = events.on;
    this.once = events.once;
    this.emit = events.emit;
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
   * ```typescript
   * Anime.term('jujutsu kaisen', results => {
   *   // Do something with it...
   * })
   * ```
   */
  async term(
    s: string,
    cb: (s: SearchResult[]) => void
  ): Promise<SearchResult[] | undefined> {
    let results: SearchResult[];
    try {
      const search = await axios.get('https://simply.moe', {
        method: 'GET',
        params: { s },
      });
      const document = (new JSDOM(search.data)).window.document;
      const _a: any = Array.from();
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
      } else {
        return results;
      }
    } catch (e) {
      if (this.catch) {
        throw e;
      } else {
        this.emit('error', e);
        return;
      }
    }
  }
}
