import * as React from 'react';
import { connect } from 'react-redux';
import { fetchCheckingAccounts } from './CheckingAccountActions';
import { withRouter } from 'react-router-dom';
import { ListCheckingAccounts } from './ListCheckingAccounts';

const mapStateToProps = ({
  checkingAccounts: { list, isFetching, reports, total }
}) => ({
  list,
  reports,
  total,
  isFetching
});

const mapDispatchToProps = dispatch => ({
  onFetchs: () => dispatch(fetchCheckingAccounts())
});

export const ListCheckingAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCheckingAccounts)
);
