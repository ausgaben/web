const PREFIX = 'CHECKING_ACCOUNT';
export const FETCH = `${PREFIX}_FETCH`;
export const FETCH_BY_ID = `${PREFIX}_FETCH_BY_ID`;
export const FETCHING = `${PREFIX}_FETCHING`;
export const ERROR = `${PREFIX}_ERROR`;
export const SELECT = `${PREFIX}_SELECT`;
export const UPDATE_SETTING = `${PREFIX}_UPDATE_SETTINGS`;
export const LIST_SPENDINGS = `${PREFIX}_LIST_SPENDINGS`;
export const ADD_SPENDINGS = `${PREFIX}_ADD_SPENDINGS`;

export const fetch = url => ({
  type: FETCH,
  url
});

export const fetchById = id => ({
  type: FETCH_BY_ID,
  id
});

export const error = error => ({
  type: ERROR,
  error
});

export const updateSetting = (checkingAccount, setting, value) => ({
  type: UPDATE_SETTING,
  checkingAccount,
  setting,
  value
});

export const listSpendings = (
  checkingAccount,
  refresh = false,
  year,
  month
) => ({
  type: LIST_SPENDINGS,
  checkingAccount,
  refresh,
  year,
  month
});

export const addSpendings = (checkingAccount, spendings) => ({
  type: ADD_SPENDINGS,
  checkingAccount,
  spendings
});
