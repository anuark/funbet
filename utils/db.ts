import { MongoClient, Db } from 'mongodb';

const url: any = process.env.MONGO_URL;
const client = new MongoClient(url);

export const newConnection = async (): Promise<Db> => {
    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // await client.db('funbet').command({ hello: 1 });
    return client.db('funbet');
}
