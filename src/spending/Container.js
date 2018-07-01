import * as React from 'react';
import { connect } from 'react-redux';
import { Add } from './elements/Add';
import { addSpending } from './Actions';
import { withRouter } from 'react-router-dom';
import { fetchCheckingAccounts } from '../dashboard/CheckingAccountActions';
import { fetch } from '../checking-account/Actions';

const mapStateToProps = (
  { spending: { isAdding, error }, checkingAccounts: { list } },
  { match: { params } }
) => {
  const checkingAccount = list.find(
    ({ $id: { uuid } }) => uuid.toString() === params.id
  );
  return {
    list,
    checkingAccount,
    submitting: false,
    error
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchList: () => dispatch(fetchCheckingAccounts()),
  onFetch: () => dispatch(fetch()),
  onAddSpending: name => dispatch(addSpending(name))
});

export const Container = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Add)
);
