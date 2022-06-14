import createConnection from './db';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { shuffle } from './util';

const generateData = async (): Promise<void> => {
    const db = await createConnection();
    const matchesCol = db.collection('matches');
    const playersCol = db.collection('players');

    // cleanup
    await playersCol.deleteMany({});
    await matchesCol.deleteMany({});

    // generating fake data
    for (let i = 0; i < 6; i++) {
        await playersCol.insertOne({
            name: faker.internet.userName(),
        });
    }

    for (let i = 0; i < 10; i++) {
        const homeScore = Math.floor(Math.random() * 5);
        const awayScore = Math.floor(Math.random() * 5);
        const day = dayjs().add(1 * i, 'hour');
        
        await matchesCol.insertOne({
            homeTeam: faker.company.companyName(),
            awayTeam: faker.company.companyName(),
            homeScore: homeScore,
            awayScore: awayScore,
            matchDate: day.toDate(),
            decided: false,
            homePlayersIds: [],
            awayPlayersIds: [],
            drawPlayersIds: [],
        });
    }

    // randomize votes
    // const matches = await matchesCol.find().toArray();
    // let players = await playersCol.find().toArray();
    // for (let i=0; i<10; i++) {
    //     const match = matches[i];
    //     players = shuffle(players);
    //     for (let j=0; j<players.length; j++) {
    //         const player = players[j];
    //         if (j%2 == 0) {
    //             await matchesCol.updateOne(
    //                 { _id: new ObjectId(match._id) },
    //                 { $push: { homePlayersIds: new ObjectId(player._id) } },
    //             );
    //         } else {
    //             await matchesCol.updateOne(
    //                 { _id: new ObjectId(match._id) },
    //                 { $push: { awayPlayersIds: new ObjectId(player._id) } },
    //             );
    //         }
    //     }
    // }

    console.log('success');
}

generateData().then(() => process.exit());
