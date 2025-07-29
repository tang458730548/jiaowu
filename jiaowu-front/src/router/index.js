import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../views/Home';
import About from '../views/About';
import Login from '../components/Login';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
};

export default Routes;
