import React from 'react';
import { Router, Route } from 'react-router';
import { createHashHistory } from 'history';
import { NavLink } from 'react-router-dom';

import Home from './home';
import Search from './search';
import store from '../store.js';

const history = createHashHistory();

export default class extends React.Component {

  constructor() {
    super();

    this.state = {
      shows: []
    };
  }

  componentDidMount() {
    store.readAll((err, shows) => {
      this.setState(Object.assign(this.state, {
        shows: shows.map(show => {
          const s = show.Data.Series[0];
          return { id: s.id[0], name: s.SeriesName[0] };
        })
      }));
    });
  }

  render() {
    return (
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
                  <h5 className="nav-group-title">My Shows</h5>
                  { this.state.shows.map(renderShow) }
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
  }
};

function renderShow({ id, name }) {
  return (
    <NavLink to={`/show/${id}`} key={ id } className='nav-group-item' exact>
      { name }
    </NavLink>
  );
}
