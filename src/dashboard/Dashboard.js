import * as React from 'react';
import { userType } from '../login/LoginReducer';
import { AddAccountContainer } from './AddAccountContainer';
import { ListAccountContainer } from './ListAccountsContainer';

import styles from './Dashboard.scss';

export const Dashboard = ({ user }) => {
  if (!user) return null;
  return (
    <>
      <ListAccountContainer />
      <AddAccountContainer />
    </>
  );
};

Dashboard.propTypes = {
  user: userType
};
