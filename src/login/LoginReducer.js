import PropTypes from 'prop-types';
import {
  LOGIN,
  LOGIN_FAILED,
  NEW_PASSWORD_REQUIRED,
  LOGIN_SUCCESS,
  AUTO_LOGIN,
  LOGOUT
} from './LoginActions';

const defaultState = () => ({
  isLoggingIn: false,
  newPasswordRequired: false,
  name: ''
});

export const LoginReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case LOGIN:
      const { username, password, newPassword, name } = action;
      return {
        ...state,
        isLoggingIn: true,
        username,
        password,
        newPasswordRequired: false,
        newPassword,
        name: name || '',
        error: undefined
      };
    case LOGIN_FAILED:
      const { error } = action;
      return {
        ...state,
        isLoggingIn: false,
        error
      };
    case NEW_PASSWORD_REQUIRED:
      return {
        ...state,
        newPasswordRequired: true,
        name: action.name
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
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
