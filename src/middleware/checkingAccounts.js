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
import { ADD_SPENDING } from '../spending/Actions';
import * as CheckingAccountActions from '../checking-account/Actions';
import { ApiGatewayClient } from '../aws/ApiGatewayClient';
import { CognitoAuth } from '../aws/CognitoAuth';
import { LOCATION_CHANGE } from 'react-router-redux';
import { URIValue } from '@rheactorjs/value-objects';

const cognitoAuth = new CognitoAuth();
const apiClients = {};
const client = token => {
  if (!apiClients[token]) {
    apiClients[token] = new ApiGatewayClient(token);
  }
  return apiClients[token];
};

const getCurrentCheckingAccount = getState => {
  const id = getState().checkingAccount.selected;
  return getState().checkingAccounts.list.find(({ $id }) => $id.equals(id));
};

export const CheckingAccountMiddleware = ({
  dispatch,
  getState
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
    case CheckingAccountActions.FETCH:
      await client(await cognitoAuth.token())
        .get(action.url)
        .then(res => {
          dispatch(checkingAccountList([res]));
          dispatch(fetchCheckingAccountReport(res));
        })
        .catch(err => dispatch(CheckingAccountActions.error(err)));
      break;
    case CheckingAccountActions.UPDATE_SETTING:
      const account = getCurrentCheckingAccount(getState);
      dispatch(
        checkingAccountList([
          account.updated({ [action.setting]: action.value }),
          ...getState().checkingAccounts.list.filter(
            ({ $id }) => !$id.equals(account.$id)
          )
        ])
      );

      await client(await cognitoAuth.token()).putLink(
        account,
        `update-${action.setting}`,
        { value: action.value },
        { ['IF-Match']: account.$version }
      );

      break;
    case ADD_SPENDING:
      await client(await cognitoAuth.token()).postLink(
        action.checkingAccount,
        `create-spending`,
        action.spending
      );
  }
};
