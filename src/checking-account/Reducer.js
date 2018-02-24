import PropTypes from 'prop-types';
import {} from './Actions';
import { FETCHING, FETCHED, FETCH_FAILED } from './Actions';
import { UPDATE_SETTINGS } from './Actions';

const defaultState = () => ({
  fetching: false,
  updatingSettings: {}
});

export const CheckingAccountReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        fetching: true
      };
    case FETCHED:
      return {
        ...state,
        fetching: false,
        item: action.item
      };
    case FETCH_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case UPDATE_SETTINGS:
      const s = {
        ...state,
        updatingSettings: {
          ...state.updatingSettings,
          ...Object.keys(action.settings).reduce(
            (keys, key) => ({ ...keys, [key]: true }),
            {}
          )
        }
      };
      console.log(s);
      return s;
    default:
      return state;
  }
};
