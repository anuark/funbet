import { Player } from './models';
import { Db } from 'mongodb';

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (a: any[]): any[] => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

export const parseAuthorization = async(authorization: string, db: Db): Promise<[boolean, Player]> => {
    let player: Player;
    if (!authorization) {
        return [true, player];
    }

    const encodedBase64: string = authorization.split('Bearer ')[1];
    if (!encodedBase64) {
        return [true, player];
    }

    const decoded = JSON.parse(atob(encodedBase64));
    if (!decoded) {
        return [true, player];
    }

    // TODO: check if accessToken is valid
    const playersCol = db.collection('players');
    const playerModel = await playersCol.findOne({ discordId: decoded.id });
    player = {
        _id: null,
        accessToken: decoded.accessToken,
        refreshToken: decoded.refreshToken,
        avatarUrl: decoded.avatarUrl,
        discordId: decoded.id,
        username: decoded.username,
        lastActiveDate: new Date(),
    }

    if (playerModel) {
        player._id = playerModel._id;
    } else {
        const record: any = await playersCol.insertOne(player);
        player._id = record.insertdId;
    }


    return [false, player];
}

