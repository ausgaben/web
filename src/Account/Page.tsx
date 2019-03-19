import React from 'react';
import { Info } from './Info';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Account } from '../schema';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';

export const accountsQuery = `
  query accounts($uuid: ID!) {
    accounts(filter: {uuid: $uuid}) {
      items {
        name
        isSavingsAccount
      }
    }
  }
`;

export const AccountPage = ({
  match: {
    params: { uuid }
  }
}: {
  match: { params: { uuid: string } };
}) => (
  <Connect query={graphqlOperation(accountsQuery, { uuid })}>
    {({ data, loading, errors }: any) => {
      if (errors.length) {
        return (
          <>
            <h3>Error</h3>
            {JSON.stringify(errors)}
          </>
        );
      }
      if (loading || !data) return <Loading text={'Loading account ...'} />;
      if (data.accounts.items.length) {
        const account = data.accounts.items[0] as Account;
        return (
          <>
            <Info account={account} />
          </>
        );
      }
      return <Note>Account {uuid} not found.</Note>;
    }}
  </Connect>
);
