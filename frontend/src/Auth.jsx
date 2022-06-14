import { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Auth = () => {
    console.log('Auth');
    useEffect(() => {

        // fetch('https://discord.com/api/users/@me', {
        // 	headers: {
        // 		authorization: `${tokenType} ${accessToken}`,
        // 	},
        // })
        // .then(result => result.json())
        // .then(response => {
        //     const { username, discriminator } = response;
        //     document.getElementById('info').innerText += ` ${username}#${discriminator}`;
        // })
        // .catch(console.error);
    }, []);

    return (
        <Container>
            <Row>
                <Col><Button href="https://discord.com/api/oauth2/authorize?client_id=981374709298004049&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord&response_type=code&scope=identify">Discord</Button></Col>
            </Row>
        </Container>
    );
};

export default Auth;
