import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import logo from './ultimate_bet.png';
import { useApp } from './providers/AppProvider';

const Header = () => {
    const { user } = useApp();
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} height="50px" alt='logo' />
                    <p className="text-muted">Ultimate bet</p>
                </Navbar.Brand>
                <Nav.Link href="#">Matches</Nav.Link>
                <Nav.Link href="#">Players</Nav.Link>
                {user != null ? <Navbar.Text><Image src={user.avatarUrl} roundedCircle/> <p>{ user.username }</p></Navbar.Text> : <Navbar.Text><Button href="/auth">Sign in</Button></Navbar.Text>}
            </Container>
        </Navbar>
    );
};

export default Header;
