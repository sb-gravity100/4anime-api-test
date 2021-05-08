/// <reference types="node" />
import { IEpisodeHrefs, IAnimeData, IAnimeEpisode, IEpisodeOptions, ISearchJSON, IAnimeOptions, IBase } from '../interfaces';
import { HTMLElement } from 'node-html-parser';
import { EventEmitter } from 'events';
export declare class Base extends EventEmitter implements IBase {
    /**
     * @defaultValue false
     * @readonly
     */
    protected _catch: boolean;
    constructor(options?: IAnimeOptions);
    /** @protected */
    protected episodes(anime: ISearchJSON, options?: IEpisodeOptions): Promise<IAnimeData>;
    /** @protected */
    protected hrefsData(hrefs: IEpisodeHrefs[]): Promise<IAnimeEpisode[]>;
    /** @protected */
    protected _search(item: HTMLElement): Promise<ISearchJSON>;
    /**
     * @protected
     * @beta
     */
    protected filter_eps(anime: ISearchJSON, options: IEpisodeOptions): IEpisodeHrefs[];
}
