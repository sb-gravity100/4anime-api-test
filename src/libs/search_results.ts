import { TAnimeType, IEpisodeHrefs, TAnimeStatus } from '../interfaces'
import { parse, HTMLElement } from 'node-html-parser';
import axios from 'axios'

export default async (item: HTMLElement) => {
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
   return {
      title,
      main,
      type,
      year,
      genres,
      hrefs,
      status,
   };
};
