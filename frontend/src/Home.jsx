import { useEffect, useState } from 'react';
import { matchesList, castVote } from './restApi.js';
import './Home.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useApp } from './providers/AppProvider.jsx';

const Home = () => {
    const [matches, setMatches] = useState([]);
    const { user, setAlert } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        matchesList(user).then(res => {
            setMatches(res.matches)
        });
    }, [])

    const vote = (type, matchId) => {
        if (!user) {
            setAlert({ variant: 'info', text: 'You need to login first' });
            navigate('/auth');
            return;
        }

        if (type === 'home') {
            document.getElementById(matchId + '-home')
                .className = 'btn btn-primary';
            document.getElementById(matchId + '-draw')
                .className = 'btn btn-secondary';
            document.getElementById(matchId + '-away')
                .className = 'btn btn-secondary';

            castVote(user, matchId, 'home');
        } else if (type === 'draw') {
            document.getElementById(matchId + '-home')
                .className = 'btn btn-secondary';
            document.getElementById(matchId + '-draw')
                .className = 'btn btn-primary';
            document.getElementById(matchId + '-away')
                .className = 'btn btn-secondary';

            castVote(user, matchId, 'draw');
        } else if (type === 'away') {
            document.getElementById(matchId + '-home')
                .className = 'btn btn-secondary';
            document.getElementById(matchId + '-draw')
                .className = 'btn btn-secondary';
            document.getElementById(matchId + '-away')
                .className = 'btn btn-primary';

            castVote(user, matchId, 'away');
        }
    }

    return (
        <div>
            {matches && matches.map((m) =>
                <Container key={m._id} className="mb-5" data-id={m._id}>
                    <Row className="p-3">
                        <Col>{m.homeTeam}</Col>
                        <Col>{m.homeScore}:{m.awayScore}</Col>
                        <Col>{m.awayTeam}</Col>
                    </Row>
                    <Row><Col></Col><Col>Vote for:</Col><Col></Col></Row>
                    <Row>
                        <Col><Button id={m._id + '-home'} onClick={() => vote('home', m._id)} variant="secondary">Home</Button></Col>
                        <Col><Button id={m._id + '-draw'} onClick={() => vote('draw', m._id)} variant="secondary">Draw</Button></Col>
                        <Col><Button id={m._id + '-away'} onClick={() => vote('away', m._id)} variant="secondary">Away</Button></Col>
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default Home;
