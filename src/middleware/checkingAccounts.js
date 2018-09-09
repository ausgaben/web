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
import { ADD, success } from '../spending/Actions';
import * as CheckingAccountActions from '../checking-account/Actions';
import { ApiGatewayClient } from '../aws/ApiGatewayClient';
import { CognitoAuth, NotAuthenticatedError } from '../aws/CognitoAuth';
import { URIValue } from '@rheactorjs/value-objects';
import { ID } from '@rheactorjs/models';
import { logout } from '../login/LoginActions';
import { LIST_SPENDINGS } from '../checking-account/Actions';
import { addSpendings } from '../checking-account/Actions';
import { listSpendings } from '../checking-account/Actions';

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
  return getState().checkingAccounts.list.find(({$id}) => $id.equals(id));
};

const fetchAllSpendings = async (dispatch, checkingAccount, fetchPromise) => {
  const res = await fetchPromise;
  dispatch(addSpendings(checkingAccount, res.items));
  if (res.hasNext) {
    return fetchAllSpendings(
      dispatch,
      checkingAccount,
      client(await cognitoAuth.token()).postLink(res, 'next')
    );
  }
};

const listCheckingAccounts = async (dispatch) => client(await cognitoAuth.token()).post(
  'checking-account/search'
).then(({items}) => {
  dispatch(checkingAccountList(items));
  items.forEach(checkingAccount =>
    dispatch(fetchCheckingAccountReport(checkingAccount))
  );
  return items;
})

export const CheckingAccountMiddleware = ({
                                            dispatch,
                                            getState
                                          }) => next => async action => {
  next(action); // we don't intercept actions here
  const {type} = action;
  try {
    switch (type) {
      case FETCH_CHECKING_ACCOUNTS:
        listCheckingAccounts(dispatch);
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
      case CheckingAccountActions.FETCH_BY_ID:
        await listCheckingAccounts(dispatch)
        break;
      case CheckingAccountActions.UPDATE_SETTING:
        const account = getCurrentCheckingAccount(getState);
        dispatch(
          checkingAccountList([
            account.updated({[action.setting]: action.value}),
            ...getState().checkingAccounts.list.filter(
              ({$id}) => !$id.equals(account.$id)
            )
          ])
        );

        await client(await cognitoAuth.token()).putLink(
          account,
          `update-${action.setting}`,
          {value: action.value},
          {['IF-Match']: account.$version}
        );

        break;
      case ADD:
        await client(await cognitoAuth.token()).postLink(
          action.checkingAccount,
          `create-spending`,
          action.spending
        );
        dispatch(success());
        dispatch(listSpendings(action.checkingAccount, true));
        dispatch(fetchCheckingAccountReport(action.checkingAccount));
        break;
      case LIST_SPENDINGS:
        fetchAllSpendings(
          dispatch,
          action.checkingAccount,
          client(await cognitoAuth.token()).postLink(
            action.checkingAccount,
            `spendings`
          )
        );
    }
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      dispatch(logout());
    } else {
      throw err;
    }
  }
};
