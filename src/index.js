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
import { AuthMiddleware } from './middleware/auth';
import { LoginReducer } from './login/LoginReducer';
import { CheckingAccountsReducer } from './dashboard/CheckingAccountsReducer';
import { DashboardContainer } from './dashboard/DashboardContainer';
import { CheckingAccountMiddleware } from './middleware/checkingAccounts';
import { CheckingAccountContainer } from './checking-account/Container';
import { CheckingAccountReducer } from './checking-account/Reducer';
import { AddContainer } from './spending/AddContainer';
import { SpendingReducer } from './spending/Reducer';
import { EditContainer } from './spending/EditContainer'
import { SpendingMiddleware } from './middleware/spending'

const browserHistory = createHistory();
const store = createStore(
  combineReducers({
    login: LoginReducer,
    checkingAccounts: CheckingAccountsReducer,
    checkingAccount: CheckingAccountReducer,
    spending: SpendingReducer,
    routing: routerReducer
  }),
  applyMiddleware(
    AuthMiddleware,
    CheckingAccountMiddleware,
    SpendingMiddleware,
    routerMiddleware(browserHistory)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
      <>
        <Route exact path="/" component={DashboardContainer} />
        <Route
          path="/checking-account/:id"
          component={CheckingAccountContainer}
        />
        <Route path="/new/spending/for/:checkingAccountId" component={AddContainer} />
        <Route path="/spending/:spendingId/in/:checkingAccountId" component={EditContainer} />
        <Route path="/login" component={LoginContainer} />
      </>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
