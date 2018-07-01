import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CheckingAccountPage } from './elements/Page';
import { fetch, updateSetting } from './Actions';
import { URIValue } from '@rheactorjs/value-objects';
import { fetchCheckingAccounts } from '../dashboard/CheckingAccountActions';

const mapStateToProps = (
  { checkingAccounts: { list, reports }, checkingAccount: { error, pending } },
  { match: { params } }
) => {
  const checkingAccount = list.find(
    ({ $id: { uuid } }) => uuid.toString() === params.id
  );
  const report =
    checkingAccount && reports[checkingAccount.$id.uuid.toString()];
  return {
    list,
    checkingAccount,
    report,
    error,
    pending
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchList: () => dispatch(fetchCheckingAccounts()),
  onFetch: () => dispatch(fetch()),
  onUpdate: (setting, value) => dispatch(updateSetting(setting, value))
});

export const CheckingAccountContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckingAccountPage)
);
