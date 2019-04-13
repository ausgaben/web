import React from 'react';
import { AddSpending } from '../AddSpending/AddSpending';
import { WithAccount } from '../Accounts/WithAccount';

export const AddAccountSpendingPage = (props: any) => (
  <main>
    <WithAccount {...props}>
      {account => <AddSpending account={account} />}
    </WithAccount>
  </main>
);
