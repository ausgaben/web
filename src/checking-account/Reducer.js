import { SELECT, ERROR } from './Actions';

const defaultState = () => ({
  pending: 0
});

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
