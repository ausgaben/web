import React from 'react';
import { Info } from './Info';
import { Account } from '../schema';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const accountQuery = gql`
  query accounts($uuid: ID!) {
    accounts(filter: { uuid: $uuid }) {
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
  <Query query={accountQuery} variables={{ uuid }}>
    {({ data, loading, error }: any) => {
      if (error) {
        return (
          <>
            <h3>Error</h3>
            {JSON.stringify(error)}
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
  </Query>
);
