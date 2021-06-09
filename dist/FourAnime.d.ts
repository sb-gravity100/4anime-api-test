import { SearchResult } from './classes';
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
export declare function term(s: string): Promise<SearchResult[]>;
