import React from 'react';
import { AddSpending } from '../AddSpending/AddSpending';
import { WithAccount } from '../Accounts/WithAccount';

export const AddAccountSpendingPage = (props: any) => (
  <WithAccount {...props}>
    {account => <AddSpending account={account} />}
  </WithAccount>
);
