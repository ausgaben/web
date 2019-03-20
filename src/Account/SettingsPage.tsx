import React from 'react';
import { Settings } from './Settings';
import { Page } from './Page';

export const AccountSettingsPage = Page(account => (
  <Settings account={account} />
));
