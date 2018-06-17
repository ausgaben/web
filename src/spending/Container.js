import * as React from 'react';
import { connect } from 'react-redux';
import { Add } from './elements/Add';
import { addSpending } from './Actions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({
  spending: { isAdding, error },
  checkingAccounts: { list, reports },
  checkingAccount: { selected }
}) => {
  const checkingAccount = list.find(({ $id }) => $id.equals(selected));
  return {
    checkingAccount,
    submitting: false,
    error
  };
};

const mapDispatchToProps = dispatch => ({
  onAddSpending: name => dispatch(addSpending(name))
});

export const Container = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Add)
);
