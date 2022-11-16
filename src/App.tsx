import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import WelcomePage from 'components/welcomPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/welcome" />} />
        <Route path="welcome" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
