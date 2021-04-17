/// <reference types="node" />
declare module "4anime" {
    import { EventEmitter } from 'events';
    type AnimeStatus = 'Completed' | 'Currently Airing';
    type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
    export interface SearchResult {
        title?: string;
        link: string;
        year?: string;
        status?: AnimeStatus;
    }
    export interface AnimeEpisode {
        src: string;
        ep: number;
        filename: string;
        id: string;
    }
    export interface AnimeData {
        title?: string;
        eps?: number;
        type?: AnimeType;
        status?: AnimeStatus;
        year?: string;
        data: Array<AnimeEpisode>;
    }
    export interface AnimeOptions {
        catch?: boolean;
    }
    export interface $4Anime {
        options?: AnimeOptions;
        term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | void>;
        episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
    }
    export default class FourAnime extends EventEmitter implements $4Anime {
        options?: AnimeOptions;
        constructor(options?: AnimeOptions);
        term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | undefined>;
        episodes(a: SearchResult, cb?: (results: AnimeData | void) => void): Promise<AnimeData | void>;
        private hrefsData;
    }
}
