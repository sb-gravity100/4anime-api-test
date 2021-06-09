import {
   IEpisodeHrefs,
   TAnimeType,
   TAnimeStatus,
   IEpisodeOptions,
   ISearchJSON,
} from '../interfaces';
import { Base } from './Base';
import { EpisodesData } from './Episodes';

/**
 * A search result instance
 */
export class SearchResult extends Base {
   readonly title: string;
   readonly main: string;
   readonly type: TAnimeType;
   readonly year: string;
   readonly genres: string[];
   readonly hrefs: IEpisodeHrefs[];
   readonly status: TAnimeStatus;

   constructor(props?: ISearchJSON) {
      super();
      for (let x in props) {
         this[`${x}`] = props[x];
      }
   }
   /**
    * Fetch anime data.
    * @param {IEpisodeOptions} [options] - pass options.
    * @returns {Promise<IAnimeData>} a promise
    */
   getAnime(options?: IEpisodeOptions): Promise<EpisodesData> {
      return this.episodes(this.get(), options);
   }

   get(): ISearchJSON {
      const __s_r: ISearchJSON = {
         title: this.title,
         main: this.main,
         type: this.type,
         year: this.year,
         genres: this.genres,
         hrefs: this.hrefs,
         status: this.status,
      };
      return __s_r;
   }
}
