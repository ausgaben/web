import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CheckingAccountPage } from './elements/Page';
import { fetch, updateSetting } from './Actions';
import { URIValue } from '@rheactorjs/value-objects';

const mapStateToProps = ({
  checkingAccounts: { list, reports },
  checkingAccount: { selected, error, pending }
}) => {
  const checkingAccount = list.find(({ $id }) => $id.equals(selected));
  const report = checkingAccount && reports[checkingAccount.$id.toString()];
  return {
    checkingAccount,
    report,
    error,
    pending
  };
};

const mapDispatchToProps = dispatch => ({
  onFetch: () => dispatch(fetch()),
  onUpdate: (setting, value) => dispatch(updateSetting(setting, value))
});

export const CheckingAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CheckingAccountPage)
);
