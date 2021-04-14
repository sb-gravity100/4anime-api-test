/// <reference types="node" />
import { EventEmitter } from 'events';
export interface SearchResult {
    title: string;
    link: string;
    year: number;
    status: string;
}
export interface AnimeOptions {
    catch?: boolean;
    term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | void>;
}
export declare class FourAnime extends EventEmitter {
    options?: AnimeOptions;
    constructor(options?: AnimeOptions);
    term(s: string, cb: (s: Array<SearchResult>) => void): Promise<Array<SearchResult> | void>;
}
