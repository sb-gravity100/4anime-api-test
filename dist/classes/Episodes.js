"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodesData = void 0;
class EpisodesData {
    constructor(props) {
        this._props = props;
        for (let x in props) {
            this[`_${x}`] = props[x];
        }
    }
    get title() {
        return this._title;
    }
    get eps() {
        return this._eps;
    }
    get type() {
        return this._type;
    }
    get status() {
        return this._status;
    }
    get genres() {
        return this._genres;
    }
    get year() {
        return this._year;
    }
    get data() {
        return this._data;
    }
    get props() {
        return this._props;
    }
    getEpisodes() {
        return this._data;
    }
    get() {
        return this._props;
    }
}
exports.EpisodesData = EpisodesData;
