import { schedule } from '@netlify/functions';
import { newConnection } from '../../utils/db';
import { Db, ObjectId } from 'mongodb';

/*
 * Update players scores
 */
const update = async (event, _) => {
    const eventBody = JSON.parse(event.body);
    console.log(`Next function run at ${eventBody.next_run}.`);

    const db: Db = await newConnection();
    const matchesCol = db.collection('matches');
    const playersCol = db.collection('players');
    await matchesCol.find({ decided: false, matchDate: { '$lte': new Date() } }).forEach(m => {
        const homeScore = Math.floor(Math.random() * 5);
        const awayScore = Math.floor(Math.random() * 5);
        // fake match
        matchesCol.updateOne(
            { _id: new ObjectId(m._id) },
            { $set: { decided: true, homeScore, awayScore } }
        );

        console.log('decided', m._id);

        if (homeScore > awayScore) {
            m.homePlayersIds.forEach((playerId: ObjectId) => {
                playersCol.updateOne({ _id: playerId }, {$inc: { score: 3}})
            });
        } else if(homeScore < awayScore) {
            m.awayPlayersIds.forEach((playerId: ObjectId) => {
                playersCol.updateOne({ _id: playerId }, {$inc: { score: 3}})
            });
        } else { // draw
            m.drawPlayersIds.forEach((playerId: ObjectId) => {
                playersCol.updateOne({ _id: playerId }, {$inc: { score: 3}})
            });
        }
    });

    return {
        statusCode: 200
    };
}

// every 5mins cronjob since / (step) doesn't work
// export const handler = schedule("5,10,15,20,25,30,35,40,45,50,55,59 * * * *", update);
export const handler = schedule("@daily", update);
