const PREFIX = 'SPENDING';
export const ERROR = `${PREFIX}_ERROR`;
export const SUCCESS = `${PREFIX}_SUCCESS`;
export const ADD_SPENDING = `${PREFIX}_ADD`;

export const error = error => ({
  type: ERROR,
  error
});

export const success = () => ({
  type: SUCCESS
});

export const addSpending = (checkingAccount, spending) => ({
  type: ADD_SPENDING,
  checkingAccount,
  spending
});
