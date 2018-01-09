export const ADD_CHECKING_ACCOUNT = 'ADD_CHECKING_ACCOUNT';
export const ADDED_CHECKING_ACCOUNT = 'ADDED_CHECKING_ACCOUNT';
export const FETCH_CHECKING_ACCOUNTS = 'FETCH_CHECKING_ACCOUNTS';
export const CHECKING_ACCOUNTS = 'CHECKING_ACCOUNTS';
export const FETCH_CHECKING_ACCOUNT_REPORT = 'FETCH_CHECKING_ACCOUNT_REPORT';
export const CHECKING_ACCOUNT_REPORT = 'CHECKING_ACCOUNT_REPORT';

export const addCheckingAccount = name => ({
  type: ADD_CHECKING_ACCOUNT,
  name
});

export const addedCheckingAccount = () => ({
  type: ADDED_CHECKING_ACCOUNT
});

export const fetchCheckingAccounts = () => ({
  type: FETCH_CHECKING_ACCOUNTS
});

export const checkingAccountList = list => ({
  type: CHECKING_ACCOUNTS,
  list
});

export const fetchCheckingAccountReport = checkingAccount => ({
  type: FETCH_CHECKING_ACCOUNT_REPORT,
  checkingAccount
});

export const checkingAccountReport = report => ({
  type: CHECKING_ACCOUNT_REPORT,
  report
});
