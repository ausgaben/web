import React from 'react';
import { Settings } from './Settings';
import { WithAccount } from '../Accounts/WithAccount';
import { Main } from '../Styles';

export const AccountSettingsPage = (props: any) => (
  <Main>
    <WithAccount {...props}>
      {account => <Settings account={account} />}
    </WithAccount>
  </Main>
);
