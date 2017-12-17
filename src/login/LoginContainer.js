import * as React from 'react';
import { connect } from 'react-redux';
import { Login } from './Login';
import { login } from './LoginActions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({
  login: { isLoggingIn, error, newPasswordRequired, name }
}) => ({
  submitting: isLoggingIn,
  newPasswordRequired,
  name,
  error
});

const mapDispatchToProps = dispatch => ({
  onLogin: (email, password, newPassword, name) =>
    dispatch(login(email, password, newPassword, name))
});

export const LoginContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
