import './App.css';
import Header from './Header';
import Home from './Home';
import Players from './Players';
import Auth from './Auth';
import Alert from './Alert';
import AuthDiscord from './AuthDiscord';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// TODO: update scheduler function for updating players score
// TODO: another page layout with more colors;
// TODO: Add teams images
// TODO: Divide games by month?

function App() {
  return (
    <div className="App">
      <Header/>
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth/discord" element={<AuthDiscord />} />
      </Routes>
    </div>
  );
}

export default App;
