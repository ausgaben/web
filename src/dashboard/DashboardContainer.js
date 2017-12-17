import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

const mapStateToProps = ({ login: { userAttributes: user } }) => ({
  user
});

export const DashboardContainer = withRouter(
  connect(mapStateToProps)(Dashboard)
);
