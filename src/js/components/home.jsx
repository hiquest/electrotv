import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import store from '../store';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      groups: []
    };

    this.renderFeed = this.renderFeed.bind(this);
  }

  renderFeed() {
    if (this.state.fetching) {
      return (
        <h3 style={ {textAlign: 'center'} }>Fetching Data From <span className='firm'>thetvdb.com</span>...</h3>
      );
    } else {
      return (this.state.groups || []).map(renderGroup);
    }
  }

  render() {
    return (
      <div className="pane padded-more">
        <h1>Today is <span className="firm">{ moment().format("DD of MMMM") }</span>, { moment().format("dddd") }</h1>
        { (this.state.loading ||  this.state.spinner) ? Spinner() : this.renderFeed() }
      </div>
    );
  }

  fetch(cb) {
    this.setState(Object.assign(this.state, { fetching: true }));
    store.updateAll(() => {
      this.setState(Object.assign(this.state, { fetching: false }));
      cb();
    });
  }

  componentDidMount() {
    this.fetch(() => {
      this.setState({ loading: true, groups: [] });
      store.readAll((err, shows) => {
        shows.forEach(s => {
          const title = s['Data']['Series'][0]['SeriesName'][0];
          s['Data']['Episode'].forEach(e => e.show = title);
        });
        const eps = _.flatten(shows.map(s => s['Data']['Episode']));
        this.setState({ loading: false, groups: group(eps) });
      });
    });
  }
}

function group(eps) {
  return [
    {
      title: 'Released Last Week',
      episodes: ready(eps)
    },
    {
      title: 'Coming Up Later This Month',
      episodes: thisMonth(eps)
    },
    {
      title: 'Next Month',
      episodes: nextMonth(eps)
    }
  ];
}

function renderGroup({ title, episodes }) {
  const epJSX = episodes.length ? (
    <div className='episodes'>
      { episodes.map(renderEpisode) }
    </div>
  ) : (
    <p>Nothing's here. Add more shows</p>
  );
  return (
    <section key={ title }>
      <h3 className='groupHead'> { title } </h3>
      { epJSX }
    </section>
  );
}

function renderEpisode(ep) {
  const id = ep['id'][0];
  const name = ep.EpisodeName[0];
  const code = `S${ep['SeasonNumber'][0]}E${ep['EpisodeNumber'][0]}`;
  const ovw = ep['Overview'][0] || 'No overview / TBA';

  let banner = ep['filename'][0];
  if (banner) {
    banner = `http://thetvdb.com/banners/${banner}`;
  }

  return (
    <div className='card item' key={id}>
      <h3 className='show'>{ ep.show }</h3>
      { banner ? <img src={banner} /> : '' }
      <h3><span className='firm'>{ code }</span> { name }</h3>
      <p>{ ovw }</p>
    </div>
  );
}

function ready(eps) {
  return withinPeriod(eps, moment().add(-2, 'week'), moment());
}

function thisMonth(eps) {
  return withinPeriod(eps, moment(), moment().endOf('month'));
}

function nextMonth(eps) {
  const start = moment().add(1, 'M').startOf('month');
  const end = moment().add(1, 'M').endOf('month');
  return withinPeriod(eps, start, end);
}

function withinPeriod(eps, start, end) {
  return eps.filter(e => {
    const d = moment(e['FirstAired'][0]);
    return d.isSameOrAfter(start) && d.isBefore(end);
  });
}

function Spinner() {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
}
