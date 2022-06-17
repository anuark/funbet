import { Handler } from '@netlify/functions'
import { Db } from 'mongodb';
import { newConnection } from '../../utils/db';

export const handler: Handler = async (event, _) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod == 'GET') {
        const db: Db = await newConnection();
        const matches = db.collection('matches');
        const cursor = matches.find();
        const result = await cursor.toArray();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
        };
    }

    return {
        statusCode: 200,
        headers
    }
}

