import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry'

axiosRetry(axios, {
   retries: 3,
})

type AnimeStatus = 'Completed' | 'Currently Airing';
type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';

export interface SearchResult {
   title?: string;
   link: string;
   year?: string;
   status?: AnimeStatus;
}

export interface AnimeEpisode {
   src: string;
   ep: number;
   filename: string;
   id: string;
}

export interface AnimeData {
   title?: string;
   eps?: number;
   type?: AnimeType;
   status?: AnimeStatus;
   year?: string;
   data: Array<AnimeEpisode>;
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
      a: SearchResult,
      cb?: (results: AnimeData | void) => void
   ): Promise<AnimeData | void>;
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
         if (this.options.catch) {
            throw e;
         } else {
            this.emit('error', e);
            return;
         }
      }
   }

   async episodes(
      a: SearchResult,
      cb?: (results: AnimeData | void) => void
   ): Promise<AnimeData | void> {
      let results: AnimeData;
      try {
         const anime = await axios({
            method: 'GET',
            url: a.link,
         });
         const { document } = new JSDOM(anime.data).window;
         const arr_href: Array<URL> = Array.from(
            document.querySelectorAll('ul.episodes.range.active a'),
            (link: any) => new URL(link.href)
         );
         const type: AnimeType = document.querySelector('.details .detail a')
            .textContent;
         const title: string = document.querySelector('.single-anime-desktop')
            .textContent;
         const href_data = await this.hrefsData(arr_href);
         const all_data: AnimeData = {
            title: title,
            type: type,
            status: a.status,
            year: a.year,
            eps: arr_href.length,
            data: href_data,
         };
         if (type === 'Movie') {
            _.unset(all_data, 'eps')
         }
         results = all_data;
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
      cb?: (results: Array<AnimeEpisode>) => void
   ): Promise<Array<AnimeEpisode>> {
      let results: Array<AnimeEpisode>,
         qLength: number = 0;
      try {
         const async_handler = async (e: URL) => {
            const _anime = await axios.get(e.href);
            const { document } = new JSDOM(_anime.data).window;
            const ep: number = parseInt(e.pathname.split('-').pop()) || 1;
            const id: string = e.searchParams.get('id').toString();
            const src: string = document.querySelector(
               'video#example_video_1 source'
            ).src;
            const filename = path.basename(src);
            qLength++;
            this.emit('loaded', qLength, href.length);
            return {
               ep,
               id,
               src,
               filename,
            };
         };
         const anime_data = await Aigle.resolve(href).map(async_handler);
         // .sortBy(d => d.ep);
         results = anime_data;
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
