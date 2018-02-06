import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { autoLogin, logout } from '../login/LoginActions';
import { Navigation } from './Navigation';

const mapStateToProps = ({ login: { userAttributes: user, submitting } }) => ({
  user,
  submitting
});

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch(autoLogin()),
  logout: () => dispatch(logout())
});

export const NavigationContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
