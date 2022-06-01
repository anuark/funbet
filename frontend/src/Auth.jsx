// import { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Auth = () => {
    return (
        <Container>
            <Row>
                <Col><Button href="https://discord.com/api/oauth2/authorize?client_id=981374709298004049&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify">Discord</Button></Col>
            </Row>
        </Container>
    );
};

export default Auth;
