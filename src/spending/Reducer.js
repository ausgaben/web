import { ERROR } from './Actions';

const defaultState = () => ({
  isAdding: false
});

export const SpendingReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};
