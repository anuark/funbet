import { Handler } from '@netlify/functions'
import newConnection from '../db';
import { parseAuthorization } from '../util';
import { Db } from 'mongodb';

const rest = async (url: string, data: any): Promise<any> => {
    return fetch(url, data).then(r => r.json());
}


export const handler: Handler = async (event, _) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod == 'GET') {
        const db: Db = await newConnection();
        // const formData = new FormData();
        // TODO: refresh token request
        // formData.append('grant_type', 'authorization_code');
        // formData.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
        // formData.append('client_id', process.env.DISCORD_CLIENT_ID);
        // formData.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
        // formData.append('redirect_uri', 'http://localhost:3000/auth/discord');
        // formData.append('code', code);

        const matches = db.collection('matches');
        const cursor = matches.find();
        const result = await cursor.toArray();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ matches: result }),
        };
    }

    return {
        statusCode: 200,
        headers
    }
}

