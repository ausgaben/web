import {
  ADD_CHECKING_ACCOUNT,
  ADDED_CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_REPORT,
  CHECKING_ACCOUNTS,
  FETCH_CHECKING_ACCOUNT_REPORT,
  FETCH_CHECKING_ACCOUNTS
} from './CheckingAccountActions';

const defaultState = () => ({
  isAdding: false,
  isFetching: false,
  list: [],
  byId: {},
  reports: {},
  total: {}
});

export const CheckingAccountsReducer = (state = defaultState(), action) => {
  switch (action.type) {
    case ADD_CHECKING_ACCOUNT:
      const {name} = action;
      return {
        ...state,
        isAdding: true,
        name: name || ''
      };
    case ADDED_CHECKING_ACCOUNT:
      return {
        ...state,
        isAdding: false,
        name: undefined
      };
    case FETCH_CHECKING_ACCOUNTS:
      return {
        ...state,
        isFetching: true
      };
    case CHECKING_ACCOUNTS:
      return {
        ...state,
        isFetching: false,
        list: action.list,
        byId: action.list.reduce((accounts, account) => {
          accounts[account.$id.uuid.toString()] = account;
          return accounts;
        }, {})
      };
    case CHECKING_ACCOUNT_REPORT:
      const reports = {
        ...state.reports,
        [action.report.checkingAccount.$id.uuid.toString()]: action.report
      };
      return {
        ...state,
        reports,
        total: Object.keys(reports).reduce((total, k) => {
          const {currency} = state.list.find(
            ({$id: {uuid}}) => uuid.toString() === k
          );
          if (!total[currency]) {
            total[currency] = reports[k].balance;
          } else {
            total[currency] += reports[k].balance;
          }
          return total;
        }, {})
      };
    default:
      return state;
  }
};
