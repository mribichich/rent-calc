import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './index.css';
import AppContainer from './AppContainer';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,

  document.getElementById('root')
);

registerServiceWorker();
