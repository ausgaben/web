import { ERROR } from './Actions';

const defaultState = () => ({
  pending: 0
});

export const CheckingAccountReducer = (state = defaultState(), action) => {
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
