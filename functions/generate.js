"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var db_1 = require("./db");
var faker_1 = require("@faker-js/faker");
var mongodb_1 = require("mongodb");
var dayjs = require("dayjs");
var util_1 = require("./util");
var generateData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, matchesCol, playersCol, i, i, homeScore, awayScore, matches, players, i, match, j, player;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, db_1["default"])()];
            case 1:
                db = _a.sent();
                matchesCol = db.collection('matches');
                playersCol = db.collection('players');
                // cleanup
                return [4 /*yield*/, playersCol.deleteMany({})];
            case 2:
                // cleanup
                _a.sent();
                return [4 /*yield*/, matchesCol.deleteMany({})];
            case 3:
                _a.sent();
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < 6)) return [3 /*break*/, 7];
                return [4 /*yield*/, playersCol.insertOne({
                        name: faker_1.faker.internet.userName()
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                i = 0;
                _a.label = 8;
            case 8:
                if (!(i < 10)) return [3 /*break*/, 11];
                homeScore = Math.floor(Math.random() * 5);
                awayScore = Math.floor(Math.random() * 5);
                return [4 /*yield*/, matchesCol.insertOne({
                        home_team: faker_1.faker.company.companyName(),
                        away_team: faker_1.faker.company.companyName(),
                        home_score: homeScore,
                        away_score: awayScore,
                        match_date: dayjs().add(1 * i, 'hour')['$d'],
                        decided: false,
                        home_players_ids: [],
                        away_players_ids: []
                    })];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, matchesCol.find().toArray()];
            case 12:
                matches = _a.sent();
                return [4 /*yield*/, playersCol.find().toArray()];
            case 13:
                players = _a.sent();
                i = 0;
                _a.label = 14;
            case 14:
                if (!(i < 10)) return [3 /*break*/, 21];
                match = matches[i];
                players = (0, util_1.shuffle)(players);
                j = 0;
                _a.label = 15;
            case 15:
                if (!(j < players.length)) return [3 /*break*/, 20];
                player = players[j];
                if (!(j % 2 == 0)) return [3 /*break*/, 17];
                return [4 /*yield*/, matchesCol.updateOne({ _id: new mongodb_1.ObjectId(match._id) }, { $push: { home_players_ids: new mongodb_1.ObjectId(player._id) } })];
            case 16:
                _a.sent();
                return [3 /*break*/, 19];
            case 17: return [4 /*yield*/, matchesCol.updateOne({ _id: new mongodb_1.ObjectId(match._id) }, { $push: { away_players_ids: new mongodb_1.ObjectId(player._id) } })];
            case 18:
                _a.sent();
                _a.label = 19;
            case 19:
                j++;
                return [3 /*break*/, 15];
            case 20:
                i++;
                return [3 /*break*/, 14];
            case 21:
                console.log('success');
                return [2 /*return*/];
        }
    });
}); };
generateData().then(function () { return process.exit(); });
