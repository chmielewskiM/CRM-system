import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.scss';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import dateFnsLocalizer from 'react-widgets-date-fns';
import 'react-widgets/dist/css/react-widgets.css';

dateFnsLocalizer();

export const history = createBrowserHistory();

ReactDOM.render(
  // <React.StrictMode>
  <Router history={history}>
    <App />
  </Router>,
  //  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
