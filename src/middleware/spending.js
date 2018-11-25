import { FETCH_BY_UUID, EDIT, editSuccess } from '../spending/Actions';
import { ApiGatewayClient } from '../aws/ApiGatewayClient';
import { CognitoAuth, NotAuthenticatedError } from '../aws/CognitoAuth';
import { URIValue } from '@rheactorjs/value-objects';
import { ID } from '@rheactorjs/models';
import { Spending } from '@ausgaben/models';
import { logout } from '../login/LoginActions';
import { checkingAccountList } from '../dashboard/CheckingAccountActions';
import { addSpendings } from '../checking-account/Actions';

const cognitoAuth = new CognitoAuth();
const apiClients = {};
const client = token => {
  if (!apiClients[token]) {
    apiClients[token] = new ApiGatewayClient(token);
  }
  return apiClients[token];
};

export const SpendingMiddleware = ({
  dispatch,
  getState
}) => next => async action => {
  next(action); // we don't intercept actions here
  const { type } = action;
  try {
    const token = await cognitoAuth.token();
    switch (type) {
      case FETCH_BY_UUID:
        const [spending, checkingAccount] = await Promise.all([
          client(token).get(`spending/${action.spendingUUID}`), // FIXME: Not hypermedia,
          client(token).get(`checking-account/${action.checkingAccountUUID}`) // FIXME: Not hypermedia
        ]);
        dispatch(checkingAccountList([checkingAccount]));
        dispatch(addSpendings(checkingAccount, [spending]));
        break;
      case EDIT:
        await client(token).put(
          action.spending.$id.url.toString(),
          action.updates,
          {
            'If-Match': action.spending.$version
          }
        );
        dispatch(
          editSuccess(
            Spending.fromJSON({
              ...action.spending.toJSON(),
              ...{
                ...action.updates,
                bookedAt: action.updates.bookedAt
                  ? action.updates.bookedAt.toISOString()
                  : undefined
              },
              $version: action.spending.$version + 1
            })
          )
        );
        break;
    }
  } catch (err) {
    if (err instanceof NotAuthenticatedError) {
      dispatch(logout());
    } else {
      throw err;
    }
  }
};
