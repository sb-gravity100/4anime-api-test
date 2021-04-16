import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';

export interface SearchResult {
   title: string;
   link: string;
   year: number;
   status: string;
}

export interface AnimeData {
   title: string;
   src: string;
   ep: number;
   filename: string;
   id: string;
}

export interface AnimeOptions {
   catch?: boolean;
}

export interface $4Anime {
   options?: AnimeOptions;
   term(
      s: string,
      cb: (s: Array<SearchResult>) => void
   ): Promise<Array<SearchResult> | void>;
   episodes(
      a: string,
      cb?: (results: Array<AnimeData> | void) => void
   ): Promise<Array<AnimeData> | void>;
}

export class FourAnime extends EventEmitter implements $4Anime {
   options?: AnimeOptions;

   constructor(options?: AnimeOptions) {
      super();
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
         const { document } = new JSDOM(search.data).window;
         const _divs: any = Array.from(
            document.querySelectorAll('div#headerDIV_95 a'),
            (div: any) => {
               const text = div.textContent
                  .trim()
                  .replace(/\/\n/gi, '')
                  .replace(/\/\n/gi, '')
                  .split('\n');
               text.splice(2, 1, div.querySelector('a').href);
               const _r = _.zipObject(
                  ['title', 'year', 'link', 'status'],
                  text
               );
               return _r;
            }
         );
         results = _divs;
         if (cb) {
            cb(results);
            return;
         }
         return results;
      } catch (e) {
         if (this.options.catch) {
            throw e;
         } else {
            this.emit('error', e);
            return;
         }
      }
   }

   async episodes(
      a: string,
      cb?: (results: Array<AnimeData> | void) => void
   ): Promise<Array<AnimeData> | void> {
      let results: Array<AnimeData>;
      try {
         const anime = await axios({
            method: 'GET',
            url: a,
         });
         const { document } = new JSDOM(anime.data).window;
         const arr_href: Array<URL> = Array.from(
            document.querySelectorAll('ul.episodes.range.active a'),
            (link: any) => new URL(link.href)
         );
         const href_data = await this.hrefsData(arr_href);
         results = href_data;
         if (cb) {
            cb(results);
            return;
         }
         return results;
      } catch (e) {
         if (this.options.catch) {
            throw e;
         } else {
            this.emit('error', e);
            return;
         }
      }
   }

   private async hrefsData(
      href: Array<URL>,
      cb?: (results: Array<AnimeData>) => void
   ): Promise<Array<AnimeData>> {
      let results: Array<AnimeData>;
      try {
         const async_handler = async (e: URL) => {
            const _anime = await axios.get(e.href);
            const { document } = new JSDOM(_anime.data).window;
            const ep: number = parseInt(e.pathname.split('-').pop());
            const id: string = e.searchParams.get('id').toString();
            const title: string = Array.from(
               document.querySelectorAll('.singletitletop #titleleft'),
               (t: any) => t.textContent
            ).join(' ');
            const src: string = document.querySelector(
               'video#example_video_1_html5_api.vjs-tech'
            ).src;
            const filename = path.basename(new URL(src).pathname);
            return {
               ep,
               id,
               title,
               src,
               filename,
            };
         };
         const anime_data = await Aigle.resolve(href)
            .map(async_handler)
            .sortBy(d => d.ep);
         results = anime_data;
         if (cb) {
            cb(results);
            return;
         }
         return results;
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
