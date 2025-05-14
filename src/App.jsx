import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SearchUI from './components/SearchUI';
import ChatUI from './components/ChatUI';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchUI />} />
          <Route path="/chat" element={<ChatUI />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 