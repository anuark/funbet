import React, { useEffect, useState } from 'react';
import { matchesList } from './restApi.js';
import './Home.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useApp } from './providers/AppProvider.jsx';

const Home = () => {
    const [matches, setMatches] = useState([]);
    const { isAuth } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        matchesList().then(res => setMatches(res.matches));
    }, [])

    const vote = (type, id) => {
        if (!isAuth) {
            navigate('/auth');
        }

        if (type === 'home') {
            document.getElementById(id + '-home')
                .className = 'btn btn-primary';
            document.getElementById(id + '-draw')
                .className = 'btn btn-secondary';
            document.getElementById(id + '-away')
                .className = 'btn btn-secondary';
        } else if (type === 'draw') {
            document.getElementById(id + '-home')
                .className = 'btn btn-secondary';
            document.getElementById(id + '-draw')
                .className = 'btn btn-primary';
            document.getElementById(id + '-away')
                .className = 'btn btn-secondary';
        } else if (type === 'away') {
            document.getElementById(id + '-home')
                .className = 'btn btn-secondary';
            document.getElementById(id + '-draw')
                .className = 'btn btn-secondary';
            document.getElementById(id + '-away')
                .className = 'btn btn-primary';
        }
    }

    return (
        <div>
            {matches.map((m) =>
                <Container key={m.id} className="mb-5">
                    <Row className="p-3">
                        <Col>{m.home_team}</Col>
                        <Col>{m.home_score}:{m.away_score}</Col>
                        <Col>{m.away_team}</Col>
                    </Row>
                    <Row><Col></Col><Col>Vote for:</Col><Col></Col></Row>
                    <Row>
                        <Col><Button id={m.id + '-home'} onClick={() => vote('home', m.id)} variant="secondary">Home</Button></Col>
                        <Col><Button id={m.id + '-draw'} onClick={() => vote('draw', m.id)} variant="secondary">Draw</Button></Col>
                        <Col><Button id={m.id + '-away'} onClick={() => vote('away', m.id)} variant="secondary">Away</Button></Col>
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default Home;
