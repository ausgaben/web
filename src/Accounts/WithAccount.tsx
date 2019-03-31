import React from 'react';
import { Account } from '../schema';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Query } from 'react-apollo';
import { accountQuery } from '../graphql/queries/accountQuery';

export const WithAccount = ({
  match: {
    params: { accountId }
  },
  children
}: {
  match: { params: { accountId: string } };
  children: (account: Account) => React.ReactElement;
}) => {
  return (
    <Query query={accountQuery} variables={{ accountId }}>
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
          return children(account);
        }
        return <Note>Account {accountId} not found.</Note>;
      }}
    </Query>
  );
};
