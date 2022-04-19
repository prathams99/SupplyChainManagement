import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage/LandingPage';
import CrudPage from './components/CrudPage/CrudPage';
import QueryPage from './components/QueryPage/QueryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/crud-operations' element={<CrudPage title="CRUD Operations"/>} />
        <Route path='/query' element={<QueryPage title="Run Query"/>} />
        {/* <Route path='/addtask' element={<InputPage addTask={addTask} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
