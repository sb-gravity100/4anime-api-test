/// <reference types="node" />
import { EventEmitter } from 'events';
declare type AnimeStatus = 'Completed' | 'Currently Airing';
export interface SearchResult {
    title: string;
    link: string;
    year: string;
    status: AnimeStatus;
}
export interface AnimeData {
    title: string;
    src: string;
    ep: number;
    filename: string;
    id: string;
}
export interface AnimeOptions {
    catch?: boolean;
}
export interface $4Anime {
    options?: AnimeOptions;
    term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | void>;
    episodes(a: string, cb?: (results: Array<AnimeData> | void) => void): Promise<Array<AnimeData> | void>;
}
export declare class FourAnime extends EventEmitter implements $4Anime {
    options?: AnimeOptions;
    constructor(options?: AnimeOptions);
    term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | undefined>;
    episodes(a: string, cb?: (results: Array<AnimeData> | void) => void): Promise<Array<AnimeData> | void>;
    private hrefsData;
}
export {};
