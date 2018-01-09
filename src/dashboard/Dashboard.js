import * as React from 'react';
import { userType } from '../login/LoginReducer';
import { AddCheckingAccountContainer } from './AddCheckingAccountContainer';
import { ListCheckingAccountContainer } from './ListCheckingAccountsContainer';

import styles from './Dashboard.scss';

export const Dashboard = ({ user }) => {
  if (!user) return null;
  return (
    <>
      <ListCheckingAccountContainer />
      <AddCheckingAccountContainer />
    </>
  );
};

Dashboard.propTypes = {
  user: userType
};
