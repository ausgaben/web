import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CheckingAccountPage } from './elements/Page';
import { fetch, listSpendings, updateSetting } from './Actions';
import { URIValue } from '@rheactorjs/value-objects';
import { fetchCheckingAccounts } from '../dashboard/CheckingAccountActions';

const mapStateToProps = (
  {
    checkingAccounts: { list, reports },
    checkingAccount: { error, pending, spendings }
  },
  { match: { params } }
) => {
  const checkingAccount = list.find(
    ({ $id: { uuid } }) => uuid.toString() === params.id
  );
  return {
    list,
    checkingAccount,
    report: checkingAccount && reports[checkingAccount.$id.uuid.toString()],
    error,
    pending,
    spendings: checkingAccount && spendings[checkingAccount.$id.uuid.toString()]
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchList: () => dispatch(fetchCheckingAccounts()),
  onFetch: () => dispatch(fetch()),
  onUpdate: (setting, value) => dispatch(updateSetting(setting, value)),
  onFetchSpendings: checkingAccount => dispatch(listSpendings(checkingAccount))
});

export const CheckingAccountContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckingAccountPage)
);
