import * as React from 'react';
import { connect } from 'react-redux';
import {
  fetchCheckingAccounts,
  deleteCheckingAccount
} from './CheckingAccountActions';
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
  onFetch: () => dispatch(fetchCheckingAccounts()),
  onDelete: checkingAccount => dispatch(deleteCheckingAccount(checkingAccount))
});

export const ListCheckingAccountContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListCheckingAccounts)
);
