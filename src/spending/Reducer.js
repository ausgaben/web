import { ADD, ERROR, SUCCESS, EDIT, EDIT_SUCCESS } from './Actions';
import { ADD_SPENDINGS, LIST_SPENDINGS } from '../checking-account/Actions';

const defaultState = () => ({
  isSubmitting: false,
  success: false,
  byId: {}
});

export const SpendingReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: action.error,
        isSubmitting: false
      };
    case ADD:
      return {
        ...state,
        isSubmitting: true,
        error: undefined,
        success: false
      };
    case EDIT:
      return {
        ...state,
        isSubmitting: true,
        error: undefined,
        success: false
      };
    case EDIT_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        error: undefined,
        success: true,
        byId: {
          ...state.byId,
          [action.spending.$id.uuid.toString()]: action.spending
        }
      };
    case SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        error: undefined,
        success: true
      };
    case ADD_SPENDINGS:
      return {
        ...state,
        byId: action.spendings.reduce((spendings, spending) => {
          spendings[spending.$id.uuid.toString()] = spending;
          return spendings;
        }, {})
      };
    default:
      return state;
  }
};
