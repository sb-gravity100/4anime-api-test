import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';

export interface SearchResult {
   title: string;
   link: string;
   year: number;
   status: string;
}

export interface AnimeOptions {
   catch?: boolean;
   term(
      s: string,
      cb: (s: Array<SearchResult>) => void
   ): Promise<Array<SearchResult> | void>;
}

export class FourAnime extends EventEmitter {
   options?: AnimeOptions;

   constructor(options?: AnimeOptions) {
      super({ captureRejections: true });
      this.options = options;
   }

   async term(
      s: string,
      cb: (s: Array<SearchResult>) => void
   ): Promise<Array<SearchResult> | void> {
      let results: Array<SearchResult>;
      try {
         const search = await axios.get('https://4anime.to', {
            method: 'GET',
            params: { s },
         });
         const { document } = (new JSDOM(search.data)).window;
         // const _divs = $('div#headerDIV_95 a');
         if (cb) {
            cb(results);
            return;
         } else {
            return results;
         }
      } catch (e) {
         if (this.options.catch) {
            throw e;
         } else {
            this.emit('error', e);
            return;
         }
      }
   }
}
