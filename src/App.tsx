import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './routes';
import './styles/global.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
};

export default App;