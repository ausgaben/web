import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware
} from 'react-router-redux';

import bootstrap from './bootstrap.scss';
import materialDesignIcons from 'material-design-icons/iconfont/material-icons.css';
import { LoginContainer } from './login/LoginContainer';
import { AppContainer } from './AppContainer';
import { AuthMiddleware } from './middleware/auth';
import { LoginReducer } from './login/LoginReducer';
import { CheckingAccountReducer } from './dashboard/CheckingAccountReducer';
import { DashboardContainer } from './dashboard/DashboardContainer';
import { CheckingAccountMiddleware } from './middleware/checkingAccount';

const browserHistory = createHistory();
const store = createStore(
  combineReducers({
    login: LoginReducer,
    checkingAccount: CheckingAccountReducer,
    routing: routerReducer
  }),
  applyMiddleware(
    AuthMiddleware,
    CheckingAccountMiddleware,
    routerMiddleware(browserHistory)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <AppContainer>
        <Route exact path="/" component={DashboardContainer} />
        <Route path="/login" component={LoginContainer} />
      </AppContainer>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
