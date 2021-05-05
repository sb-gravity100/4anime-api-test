import axios from 'axios';
import { parse } from 'node-html-parser';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry';
import FormData from 'form-data';
import __sr from './libs/search_results';
import {
  I4Anime,
  IAnimeData,
  IAnimeEpisode,
  IAnimeOptions,
  IEpisodeHrefs,
  IEpisodeOptions,
  ISearchResult,
  TemitEvent,
  TonEvent,
} from './interfaces';

axiosRetry(axios, {
  retries: 3,
});

const events = new EventEmitter();

/** Represents the class for getting links from 4Anime.to. */
export class FourAnime implements I4Anime {
  /**
   * @defaultValue false
   * @readonly
   */
  public catch?: boolean;
  /**
   * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_on_eventname_listener
   }
   */
  public on: TonEvent;
  /**
   * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_once_eventname_listener
   }
   */
  public once: TonEvent;
  /**
   * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_emit_eventname_args
   }
   */
  protected emit: TemitEvent;
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
  constructor(options?: IAnimeOptions) {
    if (options) {
      this.catch = options.catch || false;
    }
    this.on = events.on;
    this.once = events.once;
    this.emit = events.emit;
  }
  /**
   * Callback for term.
   * @callback searchCallback
   * @param {object[] | void} ISearchResult
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
    cb: (s: ISearchResult[]) => void
  ): Promise<ISearchResult[] | undefined> {
    try {
      const form = new FormData();
      form.append('action', 'ajaxsearchlite_search');
      form.append('aslp', s);
      form.append(
        'options',
        'qtranslate_lang=0&set_intitle=None&customset%5B%5D=anime'
      );
      const search = await axios.post(
        'https://4anime.to/wp-admin/admin-ajax.php',
        form,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const root = parse(search.data);
      const items = root.querySelectorAll('.item');
      const results: ISearchResult[] = await Aigle.resolve(items).map(__sr);
      if (root.querySelector('.asl_nores_header')) {
        throw {
          name: 'Error',
          code: 'ANINOTFOUND',
          message: 'Anime not found',
        };
      }
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
        return null;
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
   * @param {object} anime - an object from the search results.
   * @param {object} [options] - episode options.
   * @param {episodesCallback} [cb] - optional callback.
   * @returns {object[] | void} An array of search results.
   * @see {@link FourAnime.term
   }
   * @example
   * ```typescript
   * const search = await Anime.term('jujutsu kaisen')
   * Anime.episodes(search[0], results => {
   *   // Do something with the results...
   * })
   * ```
   */
  async episodes(
    anime: ISearchResult,
    options?: IEpisodeOptions,
    cb?: (results: IAnimeData | void) => void
  ): Promise<IAnimeData | void> {
    options = _.merge({}, options);
    try {
      if (options.episodes && Number(options.episodes) !== 0) {
        let ep_filter = options.episodes;
        const testReg = /(-?\d+,?\s?)+/g;
        ep_filter = ep_filter.match(testReg).join(' ');
        console.log(ep_filter);
        const filter_arr = ep_filter
          .replace(',', ' ')
          .replace(/\s{2,}/g, ' ')
          .split(' ')
          .map(e => e.trim());
        const _include = filter_arr.filter(f => !f.includes('-')).map(Number);
        const _exclude = filter_arr
          .filter(f => f.includes('-'))
          .map(f => Number(f.replace('-', '')));
        _exclude.length > 0 &&
          _.remove(anime.hrefs, val => _exclude.includes(val.ep));
        _include.length > 0 &&
          _.remove(anime.hrefs, val => !_include.includes(val.ep));
      }
      const href_data: any = await this.hrefsData(anime.hrefs);
      const results: IAnimeData = _.merge(anime, {
        eps: href_data.length,
        data: href_data,
      });
      if (anime.type === 'Movie') {
        _.unset(results, 'eps');
      }
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
        return null;
      }
    }
  }
  /** @private */
  private async hrefsData(
    hrefs: IEpisodeHrefs[]
  ): Promise<void | IAnimeEpisode[]> {
    try {
      const async_handler = async (e: IEpisodeHrefs) => {
        const _url = new URL(e.href);
        const _anime = await axios.get(e.href);
        const document = parse(_anime.data);
        const id: number = Number(_url.searchParams.get('id'));
        const src: string = document
          .querySelector('video#example_video_1 source')
          .getAttribute('src');
        const filename = path.basename(src);
        const ep: number = Number(
          document.querySelector('.episodes.range.active .active').textContent
        );
        this.emit('loaded', e.ep, hrefs.length);
        return {
          ep,
          id,
          src,
          filename,
        };
      };
      const results: IAnimeEpisode[] = await Aigle.resolve(hrefs).map(
        async_handler
      );
      return results;
    } catch (e) {
      if (this.catch) {
        throw e;
      } else {
        this.emit('error', e);
        return null;
      }
    }
  }
}
