import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Profile from '../components/Profile';
import ProtectedRoute from '../components/ProtectedRoute';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
};

export default Routes;