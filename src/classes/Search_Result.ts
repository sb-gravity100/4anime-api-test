import {
   ISearchResult,
   IEpisodeHrefs,
   TAnimeType,
   TAnimeStatus,
   IEpisodeOptions,
   IAnimeData,
   ISearchJSON,
} from '../interfaces';
import { Base } from './Base';

export class SearchResult extends Base implements ISearchResult {
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
   async getAnime(options?: IEpisodeOptions): Promise<IAnimeData> {
      return await this.episodes(this.toJSON(), options);
   }

   toJSON(): ISearchJSON {
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
