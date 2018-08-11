import { ADD_SPENDING, ERROR, SUCCESS } from './Actions';

const defaultState = () => ({
  isAdding: false,
  success: false
});

export const SpendingReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: action.error,
        isAdding: false
      };
    case ADD_SPENDING:
      return {
        ...state,
        isAdding: true,
        error: undefined,
        success: false
      };
    case SUCCESS:
      return {
        ...state,
        isAdding: false,
        success: true
      };
    default:
      return state;
  }
};
