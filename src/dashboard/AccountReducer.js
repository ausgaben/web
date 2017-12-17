import { ADD_ACCOUNT } from './AddAccountActions';

const defaultState = () => ({ isAdding: false, isFetching: false });

export const AccountReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ADD_ACCOUNT:
      const { name } = action;
      return {
        isAdding: true,
        name: name || ''
      };
    default:
      return state;
  }
};
