import React from 'react';
import { Info } from './Info';
import { Spendings } from './Spendings';
import { WithAccount } from '../Accounts/WithAccount';

export const AccountPage = (props: any) => (
  <WithAccount {...props}>
    {account => (
      <>
        <Info account={account} />
        <Spendings account={account} />
      </>
    )}
  </WithAccount>
);
