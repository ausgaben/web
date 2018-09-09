import * as React from 'react';
import { connect } from 'react-redux';
import { Add } from './elements/Add';
import { add } from './Actions';
import { withRouter } from 'react-router-dom';
import { fetchById } from '../checking-account/Actions';

const mapStateToProps = (
  {spending: {error, success, isSubmitting}, checkingAccounts: {byId}},
  {match: {params: {checkingAccountId}}}
) => {
  return {
    checkingAccount: byId[checkingAccountId],
    error,
    success,
    isSubmitting
  };
};

const mapDispatchToProps = (dispatch, {match: {params: {checkingAccountId}}}) => ({
  onFetchCheckingAccount: () => dispatch(fetchById(checkingAccountId)),
  onAdd: (checkingAccount, spending) =>
    dispatch(add(checkingAccount, spending))
});

export const AddContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Add)
);
