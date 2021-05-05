import { IAnimeData, IAnimeDataJSON, IAnimeEpisode } from '../interfaces';

export class EpisodesData implements IAnimeData {
   protected _title: string;
   protected _eps: number;
   protected _type: string;
   protected _status: string;
   protected _genres: string[];
   protected _year: string;
   protected _data: IAnimeEpisode[];
   private _props: IAnimeDataJSON;

   constructor(props: IAnimeDataJSON) {
      this._props = props;
      for (let x in props) {
         this[`_${x}`] = props[x];
      }
   }

   get title() {
      return this._title;
   }
   get eps() {
      return this._eps;
   }
   get type() {
      return this._type;
   }
   get status() {
      return this._status;
   }
   get genres() {
      return this._genres;
   }
   get year() {
      return this._year;
   }
   get data() {
      return this._data;
   }
   get props() {
      return this._props;
   }

   getEpisodes(): IAnimeEpisode[] {
      return this._data;
   }
   toJSON(): IAnimeDataJSON {
      return this._props;
   }
}
