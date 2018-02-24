import {
  ADD_CHECKING_ACCOUNT,
  addedCheckingAccount,
  checkingAccountList,
  checkingAccountReport,
  FETCH_CHECKING_ACCOUNT_REPORT,
  FETCH_CHECKING_ACCOUNTS,
  fetchCheckingAccountReport,
  fetchCheckingAccounts
} from '../dashboard/CheckingAccountActions';
import {
  FETCH as FETCH_CHECKING_ACCOUNT,
  fetched,
  fetchFailed,
  fetching
} from '../checking-account/Actions';
import { ApiGatewayClient } from '../aws/ApiGatewayClient';
import { CognitoAuth } from '../aws/CognitoAuth';

const cognitoAuth = new CognitoAuth();
const apiClients = {};
const client = token => {
  if (!apiClients[token]) {
    apiClients[token] = new ApiGatewayClient(token);
  }
  return apiClients[token];
};

export const CheckingAccountMiddleware = ({
  dispatch
}) => next => async action => {
  next(action); // we don't intercept actions here
  const { type } = action;
  switch (type) {
    case FETCH_CHECKING_ACCOUNTS:
      const res = await client(await cognitoAuth.token()).post(
        'checking-account/search'
      );
      dispatch(checkingAccountList(res.items));
      res.items.forEach(checkingAccount =>
        dispatch(fetchCheckingAccountReport(checkingAccount))
      );
      break;
    case ADD_CHECKING_ACCOUNT:
      await client(await cognitoAuth.token()).post('checking-account', {
        name: action.name
      });
      dispatch(fetchCheckingAccounts());
      dispatch(addedCheckingAccount());
      break;
    case FETCH_CHECKING_ACCOUNT_REPORT:
      const report = await client(await cognitoAuth.token()).postLink(
        action.checkingAccount,
        'report'
      );
      dispatch(checkingAccountReport(report));
      break;
    case FETCH_CHECKING_ACCOUNT:
      dispatch(fetching());
      await client(await cognitoAuth.token())
        .get(action.id)
        .then(res => {
          dispatch(fetched(res));
          dispatch(checkingAccountList([res]));
        })
        .catch(err => dispatch(fetchFailed(err)));
      break;
  }
};
