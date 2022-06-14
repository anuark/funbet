import { Handler } from '@netlify/functions'

const rest = async (url: string, data: any): Promise<any> => {
    return fetch(url, data).then(r => r.json());
}

export const handler: Handler = async (event, _) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };
    const { code } = JSON.parse(event.body);

    if (event.httpMethod == 'POST') {
        const formData = new FormData();
        // TODO: refresh token request
        formData.append('grant_type', 'authorization_code');
        formData.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
        formData.append('client_id', process.env.DISCORD_CLIENT_ID);
        formData.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
        formData.append('code', code);
        const data = await rest('https://discord.com/api/v10/oauth2/token', {
            method: 'POST',
            headers: { accept: 'application/json' },
            body: formData
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    }

    return {
        statusCode: 200,
        headers
    }
}

