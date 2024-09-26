import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Notifications from './pages/notifications'; 
import Raffles from './pages/raffles'
import Stores from './pages/stores'
import Editorial from './pages/editorial'
import Login from './pages/login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/raffles" element={<Raffles />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/editorial" element={<Editorial />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;