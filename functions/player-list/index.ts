import { Handler } from '@netlify/functions'
import { newConnection } from '../../utils/db';
import { Db } from 'mongodb';
import { parseAuthorization } from '../../utils/util';

/*
 * Player List API
 */
export const handler: Handler = async (event, _) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod == 'GET') {
        const db: Db = await newConnection();
        const [hasError/*, player*/] = await parseAuthorization(event.headers.authorization, db);
        if (hasError) {
            return {
                statusCode: 403,
                headers,
            };
        }

        const playersCol = db.collection('players');
        const players = playersCol.find({}).sort({ score: -1 });


        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(await players.toArray()),
        };
    }

    return {
        statusCode: 200,
        headers
    }
}
