import React from 'react';
import { AddSpending } from './AddSpending';
import { Page } from './Page';

export const AddAccountSpendingPage = Page(account => (
  <AddSpending account={account} />
));
