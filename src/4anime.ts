import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';

type AnimeStatus = 'Completed' | 'Currently Airing';

export interface SearchResult {
   title: string;
   link: string;
   year: string;
   status: AnimeStatus;
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
      super({ captureRejections: true });
      this.options = options;
   }

   async term(
      s: string,
      cb: (s: Array<SearchResult>) => void
   ): Promise<Array<SearchResult> | undefined> {
      let results: Array<SearchResult>;
      try {
         const search = await axios.get('https://4anime.to', {
            method: 'GET',
            params: { s },
         });
         const { document } = new JSDOM(search.data).window;
         const _a: any = Array.from(
            document.querySelectorAll('div#headerDIV_95 a'),
            (a: any) => {
               const text = a.textContent
                  .trim()
                  .replace(/\/\n/gi, '')
                  .replace(/\/\n/gi, '')
                  .split('\n');
               text.splice(2, 1, a.href);
               const _r = _.zipObject(
                  ['title', 'year', 'link', 'status'],
                  text
               );
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

   private async hrefsData(
      href: Array<URL>,
      cb?: (results: Array<AnimeData>) => void
   ): Promise<Array<AnimeData>> {
      let results: Array<AnimeData>,
         qLength: number = 0;
      try {
         const async_handler = async (e: URL) => {
            const _anime = await axios.get(e.href);
            if (qLength === 1) {
               require('fs').writeFileSync('./index.html', _anime.data);
            }
            const { document } = new JSDOM(_anime.data, {
               url: e.href,
               runScripts: 'dangerously',
               resources: 'usable',
               contentType: 'text/html',
               includeNodeLocations: true,
            }).window;
            const ep: number = parseInt(e.pathname.split('-').pop());
            const id: string = e.searchParams.get('id').toString();
            const title: string = Array.from(
               document.querySelectorAll('.singletitletop #titleleft'),
               (t: any) => t.textContent
            ).join(' ');
            const src = document.querySelectorAll('video#example_video_1 source');
            // const filename = path.basename(src);
            // console.log(filename)
            qLength++;
            this.emit('loaded', qLength, href.length);
            return {
               ep,
               id,
               title,
               src,
               // filename,
            };
         };
         const anime_data = await Aigle.resolve(href)
            .map(async_handler)
            .sortBy(d => d.ep);
         results = anime_data;
         console.log('Returning shit');
         if (cb) {
            cb(results);
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
