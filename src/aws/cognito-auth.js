import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

export class CognitoAuth {
  constructor(
    UserPoolId = process.env.AWS_COGNITO_USERPOOL,
    ClientId = process.env.AWS_COGNITO_APP_CLIENT
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId,
      ClientId
    });
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

      const onSuccess = result => {
        const token = result.getAccessToken().getJwtToken();

        AWS.config.region = process.env.AWS_REGION;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.AWS_COGNITO_IDENTITYPOOL,
          Logins: {
            [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${
              process.env.AWS_COGNITO_USERPOOL
            }`]: result.getIdToken().getJwtToken()
          }
        });

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

  user = () => this.userPool.getCurrentUser();
}
