import * as React from 'react';
import { connect } from 'react-redux';
import { AddAccount } from './AddAccount';
import { addAccount } from './AddAccountActions';
import { withRouter } from 'react-router-dom';

const mapStateToProps = ({ account: { isAdding, error } }) => ({
  submitting: isAdding,
  error
});

const mapDispatchToProps = dispatch => ({
  onAddAccount: name => dispatch(addAccount(name))
});

export const AddAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddAccount)
);
