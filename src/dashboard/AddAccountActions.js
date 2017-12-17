export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';

export const addAccount = name => ({
  type: ADD_ACCOUNT,
  name
});

export const fetchAccounts = () => ({
  type: FETCH_ACCOUNTS
});
