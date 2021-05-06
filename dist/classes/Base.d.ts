import { IEpisodeHrefs, IAnimeData, IAnimeEpisode, IEpisodeOptions, ISearchJSON, TonEvent, TemitEvent, IAnimeOptions } from '../interfaces';
import { HTMLElement } from 'node-html-parser';
export declare class Base {
    /**
     * @defaultValue false
     * @readonly
     */
    protected _catch: boolean;
    /**
    * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_on_eventname_listener
    }
    */
    on: TonEvent;
    /**
    * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_once_eventname_listener
    }
    */
    once: TonEvent;
    /**
    * @see {@link https://nodejs.org/download/release/v13.14.0/docs/api/events.html#events_emitter_emit_eventname_args
    }
    */
    protected _emit: TemitEvent;
    constructor(options?: IAnimeOptions);
    /** @protected */
    protected episodes(anime: ISearchJSON, options?: IEpisodeOptions): Promise<IAnimeData>;
    /** @protected */
    protected hrefsData(hrefs: IEpisodeHrefs[]): Promise<IAnimeEpisode[]>;
    /** @protected */
    protected _search(item: HTMLElement): Promise<{
        title: string;
        main: string;
        type: string;
        year: string;
        genres: string[];
        hrefs: IEpisodeHrefs[];
        status: string;
    }>;
    /**
     * @protected
     * @beta
     */
    protected filter_eps(anime: ISearchJSON, options: IEpisodeOptions): IEpisodeHrefs[];
}
