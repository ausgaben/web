import * as React from 'react';
import { connect } from 'react-redux';
import { Login } from './Login';
import { login, recoverPassword } from './LoginActions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({
  login: {
    submitting,
    error,
    newPasswordRequired,
    codeRequired,
    name,
    recoverPasswordResult
  }
}) => ({
  submitting: submitting,
  newPasswordRequired,
  codeRequired,
  recoverPasswordResult,
  name,
  error
});

const mapDispatchToProps = dispatch => ({
  onLogin: ({ username, password, newPassword, name, code }) =>
    dispatch(login(username, password, newPassword, name, code)),
  onRecoverPassword: ({ username }) => dispatch(recoverPassword(username))
});

export const LoginContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
