import './App.css';
import Header from './Header';
import Home from './Home';
import Auth from './Auth';
import Alert from './Alert';
import AuthDiscord from './AuthDiscord';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Alert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth/discord" element={<AuthDiscord />} />
      </Routes>
    </div>
  );
}

export default App;
