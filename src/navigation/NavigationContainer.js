import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { autoLogin, logout } from '../login/LoginActions';
import { Navigation } from './Navigation';

const mapStateToProps = (
  {
    login: { userAttributes: user, submitting },
    checkingAccounts: { list, reports },
    checkingAccount: { selected }
  },
  { location: { pathname } }
) => {
  const checkingAccount =
    selected && list.find(({ $id }) => $id.equals(selected));
  return {
    user,
    submitting,
    page: pathname.substr(1),
    checkingAccount
  };
};

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch(autoLogin()),
  logout: () => dispatch(logout())
});

export const NavigationContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
