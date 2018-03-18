import PropTypes from 'prop-types';
import {} from './Actions';
import { FETCHING, SELECT, ERROR } from './Actions';
import { UPDATE_SETTING } from './Actions';

const defaultState = () => ({});

export const CheckingAccountReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case SELECT:
      return {
        ...state,
        selected: action.id
      };
    case ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};
