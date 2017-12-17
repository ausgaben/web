import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './ListAccounts.scss';
import { Icon } from '../button/Icon';

export class ListAccounts extends React.Component {
  componentDidMount = () => {
    this.props.onFetchAccounts();
  };

  render() {
    return (
      <form className="card">
        <div className="card-header">
          <span className="title">accounts</span>
          <Icon>account_balance_wallet</Icon>
        </div>
        <div className="card-body" />
        <div className="card-footer" />
      </form>
    );
  }
}

ListAccounts.propTypes = {
  onFetchAccounts: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired
};
