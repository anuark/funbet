import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './providers/AppProvider';

const AuthDiscord = () => {
    const navigate = useNavigate();
    const { setUser } = useApp();

    useEffect(() => {
        (async () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const code = urlSearchParams.get('code');
            if (code) {
                const authData = await fetch('http://localhost:9999/.netlify/functions/auth', {
                    method: 'POST',
                    body: JSON.stringify({ code })
                }).then(r => r.json());

                const { access_token, token_type, refresh_token } = authData;

                // TODO: error handling?
                const discordUser = await fetch('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${token_type} ${access_token}`,
                    },
                }).then(r => r.json())
                console.log({ discordUser });

                const { username, id, avatar } = discordUser;
                const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=48`
                const user = { accessToken: access_token, tokenType: token_type, refreshToken: refresh_token, username, id, avatarUrl }
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                navigate('/');
            }
        })();
    }, []);
    return (
        <>
            <p>logging in...</p>
        </>
    );
};

export default AuthDiscord;
