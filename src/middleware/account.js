import {FETCH_ACCOUNTS} from "../dashboard/AddAccountActions";
import {ApiGatewayClient} from "../aws/ApiGatewayClient";
import {CognitoAuth} from "../aws/CognitoAuth";

const cognitoAuth = new CognitoAuth();

export const AccountMiddleware = ({dispatch, getState}) => next => action => {
    next(action); // we don't intercept actions here
    const {type} = action;
    const state = getState();
    switch (type) {
        case FETCH_ACCOUNTS:
            cognitoAuth.token()
                .then(token => new ApiGatewayClient(token).post('accounts'))
                .then(res => {
                    console.log(res)
                })
            break;
    }
};
