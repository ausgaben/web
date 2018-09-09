import * as React from 'react';
import { connect } from 'react-redux';
import { Edit } from './elements/Edit';
import { edit, fetchById } from './Actions';
import { withRouter } from 'react-router-dom';
import { SpendingForm } from './elements/SpendingForm'

const mapStateToProps = (
  {spending: {error, success, isSubmitting}, spending: {byId}, checkingAccounts: {byId: checkingAccountsById}},
  {match: {params: {spendingId, checkingAccountId}}}
) => {
  const spending = byId[spendingId];
  const checkingAccount = checkingAccountsById[checkingAccountId];
  return {
    key: spending ? `${spending.$id.uuid}-${spending.$version}` : undefined,
    spending,
    checkingAccount,
    error,
    success,
    isSubmitting
  };
};

const mapDispatchToProps = (dispatch, {match: {params: {spendingId, checkingAccountId}}}) => ({
  onFetchSpending: () => dispatch(fetchById(spendingId, checkingAccountId)),
  onEdit: (spending, changes) =>
    dispatch(edit(spending, changes))
});

export const EditContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Edit)
);
