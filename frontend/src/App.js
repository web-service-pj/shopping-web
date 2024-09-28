import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Notifications from './pages/notifications'; 
import Stores from './pages/stores'
import Login from './pages/login'
import Men from './pages/men'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/login" element={<Login />} />
        <Route path="/men" element={<Men />} />
      </Routes>
    </Router>
  );
}

export default App;