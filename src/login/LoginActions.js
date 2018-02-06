export const LOGIN = 'LOGIN';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED';
export const CODE_REQUIRED = 'CODE_REQUIRED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const LOGOUT = 'LOGOUT';
export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';
export const RECOVER_PASSWORD_FAILED = 'RECOVER_PASSWORD_FAILED';

export const login = (username, password, newPassword, name, code) => ({
  type: LOGIN,
  username,
  password,
  newPassword,
  name,
  code
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

export const codeRequired = result => ({
  type: CODE_REQUIRED,
  result
});

export const autoLogin = () => ({
  type: AUTO_LOGIN
});

export const logout = () => ({
  type: LOGOUT
});

export const recoverPassword = username => ({
  type: RECOVER_PASSWORD,
  username
});

export const recoverPasswordFailed = error => ({
  type: RECOVER_PASSWORD_FAILED,
  error
});
