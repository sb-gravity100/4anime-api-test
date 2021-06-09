import { IEpisodeHrefs, TAnimeType, TAnimeStatus, IEpisodeOptions, ISearchJSON } from '../interfaces';
import { Base } from './Base';
import { EpisodesData } from './Episodes';
/**
 * A search result instance
 */
export declare class SearchResult extends Base {
    readonly title: string;
    readonly main: string;
    readonly type: TAnimeType;
    readonly year: string;
    readonly genres: string[];
    readonly hrefs: IEpisodeHrefs[];
    readonly status: TAnimeStatus;
    constructor(props?: ISearchJSON);
    /**
     * Fetch anime data.
     * @param {IEpisodeOptions} [options] - pass options.
     * @returns {Promise<IAnimeData>} a promise
     */
    getAnime(options?: IEpisodeOptions): Promise<EpisodesData>;
    get(): ISearchJSON;
}
