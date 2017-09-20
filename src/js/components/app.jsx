import React from 'react';
import { Router, Route } from 'react-router';
import { createHashHistory } from 'history';
import { NavLink } from 'react-router-dom';

import Home from './home';
import Search from './search';

const history = createHashHistory();

export default () => (
  <Router history={history}>
    <div className="window">
      <div className="window-content">
        <div className="pane-group">
          <div className="pane-sm sidebar">
            <nav className="nav-group">
              <h5 className="nav-group-title">Menu</h5>
              <NavLink to='/' className='nav-group-item' exact>
                <span className="icon icon-home"></span>
                Home
              </NavLink>
              <NavLink to='/search' className='nav-group-item' exact>
                <span className="icon icon-search"></span>
                Search
              </NavLink>
            </nav>
          </div>
          <div className="pane padded-more">
            <Route path="/" component={Home} exact />
            <Route path="/search" component={Search} exact />
          </div>
        </div>
      </div>
    </div>
  </Router>
);
