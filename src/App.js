import { Routes, Route } from 'react-router-dom';
import React, {} from 'react';

import Navigation from './components/Navigation';
import Orders from './pages/Orders';
import Login from './pages/Login';


function App() {
  
  return (
    <>
    <Navigation />
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/orders' element={<Orders />} />
    </Routes>
    </>
  );
}

export default App;
