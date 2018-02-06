import {
  LOGIN,
  loginFailed,
  newPasswordRequired,
  loginSuccess,
  AUTO_LOGIN,
  LOGOUT,
  codeRequired,
  RECOVER_PASSWORD
} from '../login/LoginActions';
import { CognitoAuth } from '../aws/CognitoAuth';
import { push } from 'react-router-redux';

export const AuthMiddleware = ({ dispatch, getState }) => next => action => {
  next(action); // we don't intercept actions here
  const { type } = action;
  const state = getState();
  switch (type) {
    case LOGIN:
      const onNewPasswordRequired = ({ name }) => {
        dispatch(newPasswordRequired(name));
      };

      const { username, password, newPassword, name, code } = state.login;

      new CognitoAuth()
        .login(
          username,
          password,
          newPassword,
          name,
          onNewPasswordRequired,
          code
        )
        .then(({ token, userAttributes }) => {
          window.localStorage.setItem('token', token);
          window.localStorage.setItem(
            'userAttributes',
            JSON.stringify(userAttributes)
          );
          dispatch(loginSuccess(token, userAttributes));
          dispatch(push('/'));
        })
        .catch(err => dispatch(loginFailed(err)));
      break;
    case RECOVER_PASSWORD:
      new CognitoAuth()
        .recoverPassword(state.login.username)
        .then(res => {
          if (res.CodeDeliveryDetails) {
            dispatch(codeRequired(res.CodeDeliveryDetails));
          } else {
            throw new Error(`Unexpected result: "${JSON.stringify(res)}"!`);
          }
        })
        .catch(err => dispatch(recoverPasswordFailed(err)));
      break;
    case AUTO_LOGIN:
      const token = window.localStorage.getItem('token');
      const userAttributes = window.localStorage.getItem('userAttributes');
      if (token && userAttributes) {
        dispatch(loginSuccess(token, JSON.parse(userAttributes)));
      } else {
        dispatch(push('/login'));
      }
      break;
    case LOGOUT:
      window.localStorage.clear();
      dispatch(push('/login'));
      break;
  }
};
