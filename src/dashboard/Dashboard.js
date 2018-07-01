import * as React from 'react';
import { userType } from '../login/LoginReducer';
import { AddCheckingAccountContainer } from './AddCheckingAccountContainer';
import { ListCheckingAccountContainer } from './ListCheckingAccountsContainer';
import { NavigationContainer } from '../navigation/NavigationContainer';
import { MainContainer } from '../main/MainContainer';

import styles from './Dashboard.scss';

export const Dashboard = ({ user }) => {
  if (!user)
    return (
      <>
        <NavigationContainer />
      </>
    );
  return (
    <>
      <NavigationContainer />
      <MainContainer>
        <ListCheckingAccountContainer />
        <AddCheckingAccountContainer />
      </MainContainer>
    </>
  );
};

Dashboard.propTypes = {
  user: userType
};
