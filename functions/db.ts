import { MongoClient, Db/*, Logger*/ } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL);
// Logger.setLevel("debug");
// Logger.setCurrentLogger((msg, context) => {
//     // Add your custom logic here
//     context['foo'] = 'bar';
//     msg = "Hello, World! " + msg;
//     console.log(msg, context);
// });

const newConnection = async (): Promise<Db> => {
    await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // await client.db('funbet').command({ hello: 1 });
    return client.db('funbet');
}

export default newConnection;
