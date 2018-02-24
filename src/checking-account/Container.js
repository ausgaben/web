import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CheckingAccountPage } from './elements/Page';
import { fetch, updateSettings } from './Actions';
import { URIValue } from '@rheactorjs/value-objects';

const mapStateToProps = (
  {
    checkingAccounts: { list },
    checkingAccount: { fetching, updatingSettings, item, error }
  },
  { location: { search } }
) => {
  const id = new URIValue(new URLSearchParams(search).get('id'));
  return {
    id,
    fetching,
    updatingSettings,
    item: item ? item : list.find(({ $id }) => $id.equals(id)),
    error
  };
};

const mapDispatchToProps = dispatch => ({
  onFetch: id => dispatch(fetch(id)),
  onUpdate: (item, settings) => dispatch(updateSettings(item, settings))
});

export const CheckingAccountContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CheckingAccountPage)
);
