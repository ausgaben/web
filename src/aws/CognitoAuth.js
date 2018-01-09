import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

import { AccessDeniedError } from '@rheactorjs/errors';

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

  login = (Username, Password, newPassword, name, onNewPasswordRequired) =>
    new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username,
        Pool: this.userPool
      });

      const authenticationDetails = new AuthenticationDetails({
        Username,
        Password
      });

      const onSuccess = session => {
        const token = session.getAccessToken().getJwtToken();

        this.setCredentials(session);

        AWS.config.credentials.refresh(error => {
          if (error) return reject(error);
          cognitoUser.getUserAttributes((err, result) => {
            if (err) return reject(err);
            const userAttributes = result.reduce(
              (attributes, { Name, Value }) => {
                attributes[Name] = Value;
                return attributes;
              },
              {}
            );
            return resolve({ token, userAttributes });
          });
        });
      };

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess,
        onFailure: reject,
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
                onFailure: reject
              }
            );
          } else {
            if (onNewPasswordRequired) {
              onNewPasswordRequired(userAttributes, requiredAttributes);
            }
            reject(new Error('New password required!'));
          }
        }
      });
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

  setCredentials = session => {
    AWS.config.region = this.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.IdentityPoolId,
      Logins: {
        [`cognito-idp.${this.Region}.amazonaws.com/${
          this.UserPoolId
        }`]: session.getIdToken().getJwtToken()
      }
    });
    return AWS.config.credentials.getPromise();
  };
}
