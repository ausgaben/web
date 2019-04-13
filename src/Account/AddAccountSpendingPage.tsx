import React from 'react';
import { AddSpending } from '../AddSpending/AddSpending';
import { WithAccount } from '../Accounts/WithAccount';
import { WithSpendings } from '../Spendings/WithSpendings';
import { Loading } from '../Loading/Loading';

export const AddAccountSpendingPage = (props: {
  location: { search: string };
  match: any;
}) => (
  <main>
    <WithAccount {...props}>
      {account => {
        const copy = new URLSearchParams(props.location.search).get('copy');
        if (copy) {
          return (
            <WithSpendings account={account} loading={<Loading />}>
              {({ spendings }) => (
                <AddSpending
                  account={account}
                  copy={spendings.find(({ _meta: { id } }) => id === copy)}
                />
              )}
            </WithSpendings>
          );
        }
        return <AddSpending account={account} />;
      }}
    </WithAccount>
  </main>
);
