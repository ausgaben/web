import React from 'react';
import { Import } from './Import';
import { WithAccount } from '../Accounts/WithAccount';

export const AccountImportPage = (props: any) => (
  <WithAccount {...props}>
    {account => <Import account={account} />}
  </WithAccount>
);
