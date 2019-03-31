import React from 'react';
import { Settings } from './Settings';
import { WithAccount } from '../Accounts/WithAccount';

export const AccountSettingsPage = (props: any) => (
  <WithAccount {...props}>
    {account => <Settings account={account} />}
  </WithAccount>
);
