export const LOGIN = 'LOGIN';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (username, password, newPassword, name) => ({
  type: LOGIN,
  username,
  password,
  newPassword,
  name
});

export const loginFailed = error => ({
  type: LOGIN_FAILED,
  error
});

export const loginSuccess = (token, userAttributes) => ({
  type: LOGIN_SUCCESS,
  token,
  userAttributes
});

export const newPasswordRequired = name => ({
  type: NEW_PASSWORD_REQUIRED,
  name
});

export const autoLogin = () => ({
  type: AUTO_LOGIN
});

export const logout = () => ({
  type: LOGOUT
});
