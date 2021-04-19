"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplyMoe = void 0;
require("core-js");
var axios_1 = __importDefault(require("axios"));
var events_1 = require("events");
var axios_retry_1 = __importDefault(require("axios-retry"));
axios_retry_1.default(axios_1.default, {
    retries: 3
});
var events = new events_1.EventEmitter();
var SimplyMoe = /** @class */ (function () {
    function SimplyMoe() {
    }
    return SimplyMoe;
}());
exports.SimplyMoe = SimplyMoe;
//# sourceMappingURL=SimplyMoe.js.map