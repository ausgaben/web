import React from 'react';
import { Import } from './Import';
import { WithAccount } from '../Accounts/WithAccount';

export const AccountImportPage = (props: any) => (
  <main>
    <WithAccount {...props}>
      {account => <Import account={account} />}
    </WithAccount>
  </main>
);
