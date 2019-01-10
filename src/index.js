import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import App from './containers/app';

import 'materialize-css/dist/css/materialize.min.css';
import 'sanitize.css/sanitize.css';
import './index.css';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter
            history={history}
        >
            <App />
        </ConnectedRouter>
    </Provider>,
  document.getElementById('root')
);
