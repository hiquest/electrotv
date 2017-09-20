import React from 'react';
import store from '../store';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      loading: false
    };
  }

  componentDidMount() {
    const show = this.state.show;
    show.followed = store.isFollowed(this.state.show.id);
    this.setState(Object.assign(this.state, { show }));
  }

  render() {
    const i = this.state.show;
    const ovw = i.overview.length > 128 ? i.overview.substring(0, 128) + "..." : i.overview;
    return (
      <div className="series card">
        <img src={i.banner} />
        <h3>{ i.name }</h3>
        <p> { ovw } </p>
        <div className='action'>
          <button
            className={ cl(this.state.downloading, this.state.show.followed) }
            disabled={this.state.downloading}
            onClick={e => follow(this, i)}>
            <span className="icon icon-star"></span>
            <span className='f1'>FOLLOW</span>
            <span className='f2'>FOLLOWING</span>
            <span className='f3'>UNFOLLOW</span>
          </button>
        </div>
      </div>
    );
  }
}

function cl(downloading, followed) {
  const out = ['btn', 'btn-large', 'btn-primary'];
  downloading && out.push('downloading');
  followed && out.push('followed');
  return out.join(' ');
}

function follow(vm, i) {
  vm.setState({ downloading: true, show: i });
  store.add(i.id, () => {
    vm.setState({ downloading: false, show: i });
  });
}
