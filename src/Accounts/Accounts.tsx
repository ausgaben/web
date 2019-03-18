import React, { Component } from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';

export const accountsQuery = `
  query accounts {
    accounts {
      items {
        name
        isSavingsAccount
      }
    }
  }
`;

export class Accounts extends Component<{}, {}> {
  render() {
    return (
      <Connect query={graphqlOperation(accountsQuery)}>
        {({ data, loading, errors }: any) => {
          if (errors) {
            return (
              <>
                <h3>Error</h3>
                {JSON.stringify(errors)}
              </>
            );
          }
          if (loading || !data) return <h3>Loading...</h3>;
          return JSON.stringify(data);
        }}
      </Connect>
    );
  }
}
