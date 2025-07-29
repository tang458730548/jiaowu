import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../views/Home';
import About from '../views/About';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
};

export default Routes;
