import React, { ReactNode } from 'react';
import { Account } from '../schema';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Query } from 'react-apollo';
import { accountQuery } from '../graphql/queries/accountQuery';
import { Info } from './Info';
import { Spendings } from './Spendings';

export const Page = (children: (account: Account) => ReactNode) => ({
  match: {
    params: { id }
  }
}: {
  match: { params: { id: string } };
}) => (
  <Query query={accountQuery} variables={{ accountId: id }}>
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
        return <>{children(account)}</>;
      }
      return <Note>Account {id} not found.</Note>;
    }}
  </Query>
);

export const AccountPage = Page(account => (
  <>
    <Info account={account} />
    <Spendings account={account} />
  </>
));
