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
        .get(getState().checkingAccount.selected)
        .then(res => {
          dispatch(CheckingAccountActions.select(res.$id));
          dispatch(checkingAccountList([res]));
        })
        .catch(err => dispatch(CheckingAccountActions.error(err)));
      break;
    case CheckingAccountActions.UPDATE_SETTING:
      const id = getState().checkingAccount.selected;
      const account = getState().checkingAccounts.list.find(({ $id }) =>
        $id.equals(id)
      );
      const { $version } = account;
      dispatch(
        checkingAccountList([
          account.updated({ [action.setting]: action.value }),
          ...getState().checkingAccounts.list.filter(
            ({ $id }) => !$id.equals(id)
          )
        ])
      );

      await client(await cognitoAuth.token()).putLink(
        account,
        `update-${action.setting}`,
        { value: action.value },
        { ['IF-Match']: $version }
      );

      break;
    case LOCATION_CHANGE:
      const { pathname, search } = action.payload;
      if (pathname === '/checking-account') {
        dispatch(
          CheckingAccountActions.select(
            new URIValue(new URLSearchParams(search).get('id'))
          )
        );
      }
      break;
  }
};
