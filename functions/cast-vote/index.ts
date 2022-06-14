import { Handler } from '@netlify/functions'
import newConnection from '../db';
import { parseAuthorization } from '../util';
import { Db, ObjectId } from 'mongodb';

const rest = async (url: string, data: any): Promise<any> => {
    return fetch(url, data).then(r => r.json());
}

enum Type { 
    Home = 'home', 
    Away = 'away', 
    Draw = 'draw' 
};
interface CastVoteRequest {
    type: Type,
    matchId: string,
}

/*
 * Cast Vote API
 */
export const handler: Handler = async (event, _) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    if (event.httpMethod == 'POST') {
        const db: Db = await newConnection();
        const [hasError, player] = await parseAuthorization(event.headers.authorization, db);
        if (hasError) {
            return {
                statusCode: 403,
                headers,
            };
        }

        const post: CastVoteRequest = JSON.parse(event.body);
        console.log({ post });

        if (!post.type || !post.matchId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'invalid request' })
            }
        }

        // const formData = new FormData();
        // TODO: refresh token request
        // formData.append('grant_type', 'authorization_code');
        // formData.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
        // formData.append('client_id', process.env.DISCORD_CLIENT_ID);
        // formData.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
        // formData.append('redirect_uri', 'http://localhost:3000/auth/discord');
        // formData.append('code', code);

        const matches = db.collection('matches');
        const match = await matches.findOne({ _id: new ObjectId(post.matchId) });
        if (!match) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'match doesn\'t exists' })
            }
        }

        if (post.type === Type.Home) {
            // TODO: prevent pushing duplicate player ids
            console.log({ player });
            matches.updateOne({ _id: new ObjectId(post.matchId) }, { $push: { homePlayersIds: player._id } });
        } else if (post.type === Type.Away) {
            matches.updateOne({ _id: new ObjectId(post.matchId) }, { $push: { awayPlayersIds: player._id } });
        } else if (post.type === Type.Draw) {
            matches.updateOne({ _id: new ObjectId(post.matchId) }, { $push: { drawPlayersIds: player._id } });
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'invalid type' })
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'successful vote'}),
        };
    }

    return {
        statusCode: 200,
        headers
    }
}

