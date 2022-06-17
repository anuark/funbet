import { useEffect, useState } from 'react';
import { playersList } from './restApi.js';
import { Table, Container } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import { useApp } from './providers/AppProvider.jsx';

const Home = () => {
    const [players, setPlayers] = useState([]);
    const { user } = useApp();
    // const navigate = useNavigate();

    useEffect(() => {
        playersList(user).then(res => {
            setPlayers(res)
        });
    }, [])

    return (
        <Container>
            <Table hover>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Position</th>
                    </tr>
                </thead>
                {players && players.map((player, i) =>
                    <tbody>
                        <tr>
                            <td>{player.username}</td>
                            <td>{player.score}</td>
                            <td>{(i+1)}</td>
                        </tr>
                    </tbody>
                )}
            </Table>
        </Container>
    );
};

export default Home;
