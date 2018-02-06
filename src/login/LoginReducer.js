import PropTypes from 'prop-types';
import {
  LOGIN,
  LOGIN_FAILED,
  NEW_PASSWORD_REQUIRED,
  LOGIN_SUCCESS,
  AUTO_LOGIN,
  LOGOUT,
  RECOVER_PASSWORD,
  CODE_REQUIRED,
  RECOVER_PASSWORD_FAILED
} from './LoginActions';

const defaultState = () => ({
  submitting: false,
  newPasswordRequired: false,
  name: ''
});

export const LoginReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case LOGIN:
      const { username, password, newPassword, name, code } = action;
      return {
        ...state,
        submitting: true,
        username,
        password,
        newPasswordRequired: false,
        codeRequired: false,
        newPassword,
        name: name || '',
        error: undefined,
        code
      };
    case LOGIN_FAILED:
      const { error } = action;
      return {
        ...state,
        submitting: false,
        error
      };
    case NEW_PASSWORD_REQUIRED:
      const { codeRequired } = action;
      return {
        ...state,
        newPasswordRequired: true,
        codeRequired,
        name: action.name
      };
    case RECOVER_PASSWORD:
      return {
        ...state,
        submitting: true,
        error: undefined,
        username: action.username
      };
    case RECOVER_PASSWORD_FAILED:
      return {
        ...state,
        submitting: false,
        error: action.error
      };
    case CODE_REQUIRED:
      return {
        ...state,
        submitting: false,
        recoverPasswordResult: action.result
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        submitting: false,
        token: action.token,
        userAttributes: action.userAttributes
      };
    case LOGOUT:
      return defaultState();
    default:
      return state;
  }
};

export const userType = PropTypes.shape({
  name: PropTypes.string.isRequired
});
