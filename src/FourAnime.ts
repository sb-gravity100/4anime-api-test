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
  /** Optional episode filtering. */
  episodes?: number[];
}

/** Interface of the FourAnime class. */
export interface $4Anime {
  on: onEvent;
  once: onEvent;
  term(
    s: string,
    cb: (s: SearchResult[]) => void
  ): Promise<SearchResult[] | void>;
  episodes(
    a: SearchResult,
    cb?: (results: AnimeData | void) => void
  ): Promise<AnimeData | void>;
}

/** Represents the class for getting links from 4Anime.to. */
export class FourAnime implements $4Anime {
  /**
   * @defaultValue false
   * @readonly
   */
  public catch?: boolean;
  /**
   * @readonly
   */
  public epNum?: number[];
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
    this.epNum = options.episodes;
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
      const search = await axios.get('https://4anime.to', {
        method: 'GET',
        params: { s },
      });
      const document = new JSDOM(search.data).window.document;
      const _a: any = Array.from(
        document.querySelectorAll('div#headerDIV_95 a'),
        (a: any) => {
          const text = a.textContent
            .trim()
            .replace(/\/\n/gi, '')
            .replace(/\/\n/gi, '')
            .split('\n');
          text.splice(2, 1, a.href);
          const _r: any = _.zipObject(
            ['title', 'year', 'link', 'status'],
            text
          );
          if (_r.title.length > 75) {
            _r.title += '...';
          }
          return _r;
        }
      );
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
  async episodes(
    a: SearchResult,
    cb?: (results: AnimeData | void) => void
  ): Promise<AnimeData | void> {
    let results: AnimeData;
    try {
      const anime = await axios.get(a.link);
      const document = new JSDOM(anime.data).window.document;
      let arr_href: any[] = Array.from(
        document.querySelectorAll('ul.episodes.range.active a'),
        (link: any) => new URL(link.href)
      );
      const type: AnimeType = document.querySelector('.details .detail a')
        .textContent;
      const title: string = document.querySelector('.single-anime-desktop')
        .textContent;
      const href_data: any = await this.hrefsData(arr_href);
      const all_data: AnimeData = {
        title: title,
        type: type,
        status: a.status,
        year: a.year,
        eps: arr_href.length,
        data: href_data,
      };
      if (type === 'Movie') {
        _.unset(all_data, 'eps');
      }
      results = all_data;
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
  /** @private */
  private async hrefsData(href: URL[]): Promise<void | AnimeEpisode[]> {
    let results: AnimeEpisode[],
      qLength: number = 0;
    try {
      const async_handler = async (e: URL) => {
        const _anime = await axios.get(e.href);
        const { document } = new JSDOM(_anime.data, {
          url: e.href,
          contentType: 'text/html',
        }).window;
        const id: number = Number(e.searchParams.get('id'));
        const src: string = document.querySelector(
          'video#example_video_1 source'
        ).src;
        const filename = path.basename(src);
        const ep: number = Number(
          document.querySelector('.episodes.range.active .active').textContent
        );
        qLength++;
        this.emit('loaded', qLength, href.length);
        return {
          ep,
          id,
          src,
          filename,
        };
      };
      const anime_data = await Aigle.resolve(href)
        .map(async_handler)
        .sortBy('ep');
      results = anime_data;
      return results;
    } catch (e) {
      if (this.catch) {
        throw e;
      } else {
        this.emit('error', e);
      }
    }
  }
}
