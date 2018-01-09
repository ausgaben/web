import * as React from 'react';
import { connect } from 'react-redux';
import { AddCheckingAccount } from './AddCheckingAccount';
import { addCheckingAccount } from './CheckingAccountActions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({ checkingAccount: { isAdding, error } }) => ({
  submitting: isAdding,
  error
});

const mapDispatchToProps = dispatch => ({
  onAddCheckingAccount: name => dispatch(addCheckingAccount(name))
});

export const AddCheckingAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddCheckingAccount)
);
