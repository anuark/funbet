import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from './ultimate_bet.png';
import { isAuthenticated } from './App.js';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} height="50px" alt='logo' />
          <p className="text-muted">Ultimate bet</p>
        </Navbar.Brand>
        <Nav.Link href="#">Matches</Nav.Link>
        <Nav.Link href="#">Players</Nav.Link>
        {isAuthenticated() ? <Navbar.Text>Authenticated</Navbar.Text> : <Navbar.Text>Sign in</Navbar.Text>}
      </Container>
    </Navbar>
  );
};

export default Header;
