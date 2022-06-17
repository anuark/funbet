import { ObjectId } from 'mongodb';

export interface Player {
    _id: ObjectId,
    accessToken: string,
    refreshToken: string,
    discordId: string,
    avatarUrl: string,
    username: string,
    lastActiveDate: Date,
    score: number,
};

export interface Match {
    _id: ObjectId,
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    matchDate: Date
    decided: boolean,
    homePlayersIds: string[],
    awayPlayersIds: string[],
    drawPlayersIds: string[],
};

export interface Game {

};
