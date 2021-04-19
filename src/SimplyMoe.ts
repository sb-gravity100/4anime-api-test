import 'core-js'
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { EventEmitter } from 'events';
import { URL } from 'url';
import path from 'path';
import _ from 'lodash';
import { Aigle } from 'aigle';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
   retries: 3
})

const events = new EventEmitter();

type AnimeStatus = 'Completed' | 'Currently Airing';
type AnimeType = 'Movie' | 'TV Series' | 'OVA' | 'Special' | 'ONA';
type onEvent = (
  event: string | symbol,
  listener: (...args: any[]) => void
) => void;
type emitEvent = (event: string | symbol, ...args: any[]) => void;

/** Search data */
export interface SearchResult {
  /** Title of the anime. */
  title?: string;
  /** Url to the anime in simply.moe */
  link: string;
  /** Year aired. */
  year?: string;
  /** 'Completed' or 'Currently Airing'. */
  status?: AnimeStatus;
}

/** Data of every episode */
export interface AnimeEpisode {
  /** Url of the source. */
  src: string;
  /** Episode number. */
  ep: number;
  /** Filename */
  filename: string;
  /** Anime id based on simply.moe */
  id: number;
}

/** Data scraped from simply.moe */
export interface AnimeData {
  /** @see {@link SearchResult.title} */
  title?: string;
  /** Number of episodes. */
  eps?: number;
  /** Type of anime...(eg. 'Movie', 'TV Series', 'OVA'...). */
  type?: AnimeType;
  /** @see {@link SearchResult.status} */
  status?: AnimeStatus;
  /** @see {@link SearchResult.year} */
  year?: string;
  /**
   * Episode data.
   * @see {@link AnimeEpisode}
   */
  data: AnimeEpisode[];
}

/** Instance options */
export interface AnimeOptions {
  /**  Set to true if you want all errors to be thrown in a catch block. */
  catch?: boolean;
}


/** Interface of the FourAnime class. */
export interface SimplyClass {
  on: onEvent;
  once: onEvent;
  term(
    s: string,
    cb: (s: SearchResult[]) => void
  ): Promise<SearchResult[] | void>;
  episodes(
    a: SearchResult,
    cb?: (results: AnimeData | void) => void
  ): Promise<AnimeData | void>;
}

export class SimplyMoe implements SimplyClass {
   constructor()
}
