import { IAnimeData, IAnimeDataJSON, IAnimeEpisode } from '../interfaces';
export declare class EpisodesData implements IAnimeData {
    protected _title: string;
    protected _eps: number;
    protected _type: string;
    protected _status: string;
    protected _genres: string[];
    protected _year: string;
    protected _data: IAnimeEpisode[];
    private _props;
    constructor(props: IAnimeDataJSON);
    get title(): string;
    get eps(): number;
    get type(): string;
    get status(): string;
    get genres(): string[];
    get year(): string;
    get data(): IAnimeEpisode[];
    get props(): IAnimeDataJSON;
    getEpisodes(): IAnimeEpisode[];
    toJSON(): IAnimeDataJSON;
}
