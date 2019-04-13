import React from 'react';
import { Spendings } from '../Spendings/Spendings';
import { WithAccount } from '../Accounts/WithAccount';

import './Account.scss';

export const AccountPage = (props: any) => (
  <main className="account">
    <WithAccount {...props}>
      {account => <Spendings account={account} />}
    </WithAccount>
  </main>
);
