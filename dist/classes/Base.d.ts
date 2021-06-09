/// <reference types="node" />
import { IEpisodeHrefs, IAnimeEpisode, IEpisodeOptions, ISearchJSON } from '../interfaces';
import { EventEmitter } from 'events';
import { EpisodesData } from './Episodes';
export declare class Base extends EventEmitter {
    /**
     * @defaultValue false
     * @readonly
     */
    protected _catch: boolean;
    constructor();
    /** @protected */
    protected episodes(anime: ISearchJSON, options?: IEpisodeOptions): Promise<EpisodesData>;
    /** @protected */
    protected hrefsData(hrefs: IEpisodeHrefs[]): Promise<IAnimeEpisode[]>;
    /**
     * @protected
     * @beta
     */
    protected filter_eps(anime: ISearchJSON, options: IEpisodeOptions): IEpisodeHrefs[];
}
