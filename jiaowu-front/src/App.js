import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Routes from './router';

const App = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/';
  return (
    <>
      {!hideNav && (
        <div id="nav">
          <NavLink exact to="/home">
            Home
          </NavLink>{' '}
          |{' '}
          <NavLink exact to="/about">
            About
          </NavLink>
        </div>
      )}
      <Routes />
    </>
  );
};

export default App;
