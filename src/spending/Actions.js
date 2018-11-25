const PREFIX = 'SPENDING';
export const ERROR = `${PREFIX}_ERROR`;
export const SUCCESS = `${PREFIX}_SUCCESS`;
export const EDIT_SUCCESS = `${PREFIX}_EDIT_SUCCESS`;
export const ADD = `${PREFIX}_ADD`;
export const EDIT = `${PREFIX}_EDIT`;
export const FETCH_BY_UUID = `${PREFIX}_FETCH_BY_ID`;
export const LIST = `${PREFIX}_LIST`;

export const error = error => ({
  type: ERROR,
  error
});

export const success = () => ({
  type: SUCCESS
});

export const editSuccess = spending => ({
  type: EDIT_SUCCESS,
  spending
});

export const fetchById = (spendingUUID, checkingAccountUUID) => ({
  type: FETCH_BY_UUID,
  spendingUUID,
  checkingAccountUUID
});

export const edit = (spending, updates) => ({
  type: EDIT,
  spending,
  updates
});

export const add = (checkingAccount, spending) => ({
  type: ADD,
  checkingAccount,
  spending
});
