import axios from 'axios';
import * as nhp from 'node-html-parser';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry';
import FormData from 'form-data';
import { Base, SearchResult } from './classes';
import { EventEmitter } from 'events'
import { I4Anime, IAnimeOptions, ISearchResult, ISearchJSON } from './interfaces';

axiosRetry(axios, {
   retries: 3,
});
const parse = nhp.parse;
/** Represents the class for getting links from 4Anime.to. */
export class FourAnime extends Base implements I4Anime {
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
      super(options);
   }

   // /**
   // * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#eventsemitter_on_eventname_listener
   // }
   // */
   // public on(
   //    event: string | symbol,
   //    listener: (...args: any[]) => void
   // ): EventEmitter {
   //    return this.on(event, listener)
   // }

   // /**
   // * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#eventsemitter_once_eventname_listener
   // }
   // */
   // public once(
   //    event: string | symbol,
   //    listener: (...args: any[]) => void
   // ): EventEmitter {
   //    return this.once(event, listener)
   // }
   
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
   async term(s: string): Promise<ISearchResult[]> {
      try {
         const form = new FormData();
         form.append('action', 'ajaxsearchlite_search');
         form.append('aslp', s);
         form.append(
            'options',
            'qtranslate_lang=0&set_intitle=None&customset%5B%5D=anime'
         );
         const headers = form.getHeaders();
         const search = await axios.post(
            'https://4anime.to/wp-admin/admin-ajax.php',
            form.getBuffer(),
            {
               headers: {
                  ...headers,
                  Referer: 'https://4anime.to',
                  Origin: 'https://4anime.to',
                  'User-Agent':
                     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
               },
            }
         );
         const root = parse(search.data.toString());
         if (root.querySelector('.asl_nores_header')) {
            throw {
               name: 'Error',
               code: 'ANINOTFOUND',
               message: 'Anime not found',
            };
         }
         const items = root.querySelectorAll('.item');
         const results: ISearchJSON[] = await Aigle.resolve(items).map(
            this._search
         );
         return results.map(_a => new SearchResult(_a));
      } catch (e) {
         if (this._catch) {
            throw e;
         } else {
            this.emit('error', e);
            return null;
         }
      }
   }
}
