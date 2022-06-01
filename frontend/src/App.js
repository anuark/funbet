import './App.css';
import Header from './Header.js';
import Home from './Home.js';
import Auth from './Auth';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
