import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'querystring';
import * as nhp from 'node-html-parser';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry';
import { SearchResult } from './classes';
import { TAnimeType, IEpisodeHrefs, TAnimeStatus } from './interfaces';

axiosRetry(axios, {
   retries: 3,
});
const parse = nhp.parse;
async function _search(item: nhp.HTMLElement) {
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
   const status: TAnimeStatus = anime
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
   return new SearchResult(props);
}
/**
 * Search an anime by a term.
 * @param {string} s - string to search for.
 * @returns {ISearchResult[]} An array of search results.
 * @example
 * ```typescript
 * Anime.on('error', console.log) // Catch errors
 * Anime.term('jujutsu kaisen').then(res => {
 *   // Do something with res
 * })
 * ```
 */
export async function term(s: string): Promise<SearchResult[]> {
   const url = 'https://4anime.to/wp-admin/admin-ajax.php';
   const data = qs.stringify({
      action: 'ajaxsearchlite_search',
      aslp: s,
      options: 'qtranslate_lang=0&set_intitle=None&customset%5B%5D=anime',
   });
   const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         Referer: 'https://4anime.to',
         Origin: 'https://4anime.to',
         'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
      },
      responseType: 'text',
   };
   const search = await axios.post<any, AxiosResponse<string>>(
      url,
      data,
      options
   );
   const root = parse(search.data);
   if (root.querySelector('.asl_nores_header')) {
      throw {
         name: 'Error',
         code: 'ANIMENOTFOUND',
         message: 'Anime not found',
      };
   }
   const items = root.querySelectorAll('.item');
   const results = await Aigle.resolve(items).map(e => _search(e));
   return results;
}
