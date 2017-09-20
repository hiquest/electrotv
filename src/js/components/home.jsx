import React from 'react';
import moment from 'moment';

export default () => (
  <h1>Today is <span className="firm">{ moment().format("DD of MMMM") }</span>, { moment().format("dddd") }</h1>
);
