import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

import { AccessDeniedError } from '@rheactorjs/errors';

const rejectAsError = reject => ({ message, code, name }) =>
  reject(new Error(message));

export class CognitoAuth {
  constructor(
    UserPoolId = process.env.AWS_COGNITO_USERPOOL_ID,
    ClientId = process.env.AWS_COGNITO_APP_CLIENT,
    IdentityPoolId = process.env.AWS_COGNITO_IDENTITYPOOL_ID,
    Region = process.env.AWS_REGION
  ) {
    this.UserPoolId = UserPoolId;
    this.userPool = new CognitoUserPool({
      UserPoolId,
      ClientId
    });
    this.IdentityPoolId = IdentityPoolId;
    this.Region = Region;
  }

  login = (
    Username,
    Password,
    newPassword,
    name,
    onNewPasswordRequired,
    code
  ) =>
    new Promise(async (resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username,
        Pool: this.userPool
      });

      const onSuccess = session => {
        const token = session.getAccessToken().getJwtToken();

        cognitoUser.getUserAttributes((err, result) => {
          if (err) return rejectAsError(reject)(err);
          const userAttributes = result.reduce(
            (attributes, { Name, Value }) => {
              attributes[Name] = Value;
              return attributes;
            },
            {}
          );
          return resolve({ token, userAttributes });
        });
      };

      if (code) {
        try {
          await new Promise((resolve2, reject2) => {
            cognitoUser.confirmPassword(code, newPassword, {
              onSuccess: resolve2,
              onFailure: rejectAsError(reject2)
            });
          });
          Password = newPassword;
        } catch (err) {
          return rejectAsError(reject)(err);
        }
      }

      cognitoUser.authenticateUser(
        new AuthenticationDetails({ Username, Password }),
        {
          onSuccess,
          onFailure: rejectAsError(reject),
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            if (newPassword && name) {
              delete userAttributes.email_verified; // the api doesn't accept this field back
              delete userAttributes.phone_number_verified; // the api doesn't accept this field back
              userAttributes.name = name; // set the new name
              return cognitoUser.completeNewPasswordChallenge(
                newPassword,
                userAttributes,
                {
                  onSuccess: onSuccess,
                  onFailure: rejectAsError(reject)
                }
              );
            } else {
              if (onNewPasswordRequired) {
                onNewPasswordRequired(userAttributes, requiredAttributes);
              }
              reject(new Error('New password required!'));
            }
          }
        }
      );
    });

  token = () =>
    new Promise((resolve, reject) => {
      const cognitoUser = this.userPool.getCurrentUser();
      if (!cognitoUser) return reject(new Error('User not authenticated.'));
      cognitoUser.getSession((err, session) => {
        if (err) {
          throw new AccessDeniedError(`User not logged in! "${err}"`);
        }
        return resolve(session.getIdToken().getJwtToken());
      });
    });

  recoverPassword = username =>
    new Promise((resolve, reject) => {
      new CognitoUser({
        Username: username,
        Pool: this.userPool
      }).forgotPassword({
        onSuccess: resolve,
        onFailure: rejectAsError(reject)
      });
    });
}
