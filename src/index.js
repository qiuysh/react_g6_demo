import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.less';
import { Router, browserHistory } from 'react-router';
import routers from './routers';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router routes={routers} history={browserHistory} />, 
  document.getElementById('root')
);

serviceWorker.unregister();
