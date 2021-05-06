import {
   TAnimeType,
   IEpisodeHrefs,
   TAnimeStatus,
   IAnimeData,
   IAnimeEpisode,
   IEpisodeOptions,
   ISearchJSON,
   TonEvent,
   TemitEvent,
   IAnimeOptions,
   IAnimeDataJSON,
} from '../interfaces';
import { parse, HTMLElement } from 'node-html-parser';
import axios from 'axios';
import _ from 'lodash';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import { Aigle } from 'aigle';
import fs from 'fs';
import axiosRetry from 'axios-retry';
import { EpisodesData } from './Episodes';

axiosRetry(axios, {
   retries: 3,
});

const events = new EventEmitter();

export class Base {
   /**
    * @defaultValue false
    * @readonly
    */
   protected _catch: boolean;
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
   protected _emit: TemitEvent;

   constructor(options?: IAnimeOptions) {
      if (options) {
         this._catch = options.catch || false;
      }
      this.on = events.on;
      this.once = events.once;
      this._emit = events.emit;
   }
   /** @protected */
   protected async episodes(
      anime: ISearchJSON,
      options?: IEpisodeOptions
   ): Promise<IAnimeData> {
      options = _.merge({}, options);
      try {
         if (options.episodes && Number(options.episodes) !== 0) {
            anime.hrefs = this.filter_eps(anime, options);
         }
         const href_data: any = await this.hrefsData(anime.hrefs);
         const results: IAnimeDataJSON = _.merge(anime, {
            eps: href_data.length,
            data: href_data,
         });
         if (anime.type === 'Movie') {
            _.unset(results, 'eps');
         }
         _.unset(results, 'hrefs');
         return new EpisodesData(results);
      } catch (e) {
         if (this._catch) {
            throw e;
         } else {
            this._emit('error', e);
            return null;
         }
      }
   }
   /** @protected */
   protected async hrefsData(hrefs: IEpisodeHrefs[]): Promise<IAnimeEpisode[]> {
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
               document.querySelector('.episodes.range.active .active')
                  .textContent
            );
            this._emit('loaded', e.ep, hrefs.length);
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
         if (this._catch) {
            throw e;
         } else {
            this._emit('error', e);
            return null;
         }
      }
   }
   /** @protected */
   protected async _search(item: HTMLElement) {
      const _name = item.querySelector('.name');
      const _meta = item.querySelectorAll('.meta .yearzi');
      const main: string = _name.getAttribute('href');
      const title: string = _name.textContent;
      const type: TAnimeType | string = _meta[0].textContent;
      const year: string = _meta[1].textContent;
      const genres: string[] = item
         .querySelectorAll('.genre a')
         .map(a => a.textContent);
      const anime = parse((await axios.get(main)).data);
      const hrefs: IEpisodeHrefs[] = anime
         .querySelectorAll('ul.episodes a')
         .map(a => ({
            href: a.getAttribute('href'),
            ep: Number(a.textContent),
         }))
         .sort((a, b) => a.ep - b.ep);
      const status: TAnimeStatus | string = anime
         .querySelectorAll('.details .detail')[3]
         .querySelector('a').textContent;
      const props = {
         title,
         main,
         type,
         year,
         genres,
         hrefs,
         status,
      };
      return props;
   }
   /**
    * @protected
    * @beta
    */
   protected filter_eps(anime: ISearchJSON, options: IEpisodeOptions) {
      let filth: any = options.episodes;
      const testReg = /(-\s+)?(\d+,?\s?)+/g;
      const rangeReg = /\d+-\d+/g;
      if (filth.match(testReg)) {
         const ranges = _.chain(
            filth.match(rangeReg).map(v => {
               let [a, b] = v.split('-').map(Number);
               let range: number[];
               if (_.gt(a, b)) {
                  if (a > anime.hrefs.length) {
                     a = anime.hrefs.length;
                  }
                  range = _.range(b, a + 1);
               } else {
                  if (b > anime.hrefs.length) {
                     b = anime.hrefs.length;
                  }
                  range = _.range(a, b + 1);
               }
               return range;
            })
         )
            .flattenDeep()
            .uniq()
            .value();
         filth = filth
            .replace(/,+/g, ' ')
            .replace(/\s+/g, ' ')
            .split(' ')
            .map(v => {
               if (Math.abs(v)) {
                  return Math.abs(v);
               }
               return v;
            })
            .filter((v, k) => {
               if (k === 0) {
                  if (v === '-' || _.isNumber(v)) {
                     return true;
                  }
                  return false;
               }
               if (_.isNumber(v)) {
                  return true;
               }
               return false;
            });
         filth = _.sortBy(_.concat(filth, ranges).filter(Boolean));
         if (filth[0] === '-') {
            _.remove(anime.hrefs, val => filth.includes(val.ep));
         } else {
            _.remove(anime.hrefs, val => !filth.includes(val.ep));
         }
         return anime.hrefs;
      }
   }
}
