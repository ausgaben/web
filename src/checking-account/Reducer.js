import { ADD_SPENDINGS, ERROR, LIST_SPENDINGS } from './Actions';

const defaultState = () => ({
  pending: 0,
  spendings: {}
});

export const CheckingAccountReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: action.error
      };
    case ADD_SPENDINGS:
      const i = action.checkingAccount.$id.uuid.toString();
      return {
        ...state,
        spendings: {
          [i]: [
            ...(state.spendings[i] ? state.spendings[i] : []),
            ...action.spendings
          ]
        }
      };
    case LIST_SPENDINGS:
      return {
        ...state,
        spendings: {
          [action.checkingAccount.$id.uuid.toString()]: []
        }
      };
    default:
      return state;
  }
};
