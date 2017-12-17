import * as React from 'react';
import { connect } from 'react-redux';
import { fetchAccounts } from './AddAccountActions';
import { withRouter } from 'react-router-dom';
import { ListAccounts } from './ListAccounts';

const mapStateToProps = ({ account: { list, isFetching } }) => ({
  list,
  fetching: isFetching
});

const mapDispatchToProps = dispatch => ({
  onFetchAccounts: () => dispatch(fetchAccounts())
});

export const ListAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListAccounts)
);
