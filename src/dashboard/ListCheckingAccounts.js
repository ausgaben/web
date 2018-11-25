import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';

import styles from './ListCheckingAccounts.scss';
import { Icon } from '../button/Icon';
import { IconWithText } from '../button/IconWithText';
import { Money } from '../money/Element';
import { IconButton } from '../button/IconButton';

export class ListCheckingAccounts extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedAccounts: {},
      deleting: false
    };
  }

  componentDidMount = () => {
    this.props.onFetch();
  };

  render() {
    const selectedAccounts = Object.keys(this.state.selectedAccounts).filter(
      key => this.state.selectedAccounts[key]
    );
    return (
      <form className="card checkingAccounts">
        <div className="card-header">
          <span className="title">Your checking accounts</span>
          <Icon>account_balance_wallet</Icon>
        </div>
        {this.props.isFetching && (
          <div className="card-body">
            <IconWithText icon={<Icon spin>hourglass_empty</Icon>}>
              Fetching ...
            </IconWithText>
          </div>
        )}
        {!this.props.isFetching && this.props.list && (
          <>
            <ul className="list-group list-group-flush">
              {this.props.list.map(checkingAccount => (
                <li
                  className="list-group-item sum clickable"
                  key={checkingAccount.$id.uuid.toString()}
                >
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(
                      checkingAccount.$id.uuid.toString()
                    )}
                    value="1"
                    onChange={() => {
                      this.setState({
                        selectedAccounts: {
                          ...this.state.selectedAccounts,
                          [checkingAccount.$id.uuid.toString()]: !this.state
                            .selectedAccounts[
                            checkingAccount.$id.uuid.toString()
                          ]
                        }
                      });
                    }}
                  />
                  <span
                    onClick={() => {
                      this.props.history.push(
                        `/checking-account/${encodeURIComponent(
                          checkingAccount.$id.uuid.toString()
                        )}`
                      );
                    }}
                  >
                    {checkingAccount.name}
                  </span>
                  {this.props.reports[checkingAccount.$id.uuid.toString()] && (
                    <span
                      onClick={() => {
                        this.props.history.push(
                          `/checking-account/${encodeURIComponent(
                            checkingAccount.$id.uuid.toString()
                          )}`
                        );
                      }}
                    >
                      <Money symbol={checkingAccount.currency}>
                        {
                          this.props.reports[
                            checkingAccount.$id.uuid.toString()
                          ].balance
                        }
                      </Money>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {selectedAccounts.length > 0 && (
              <div className="card-footer">
                <IconButton
                  icon={this.state.deleting ? 'hourglass_empty' : 'delete'}
                  color="danger"
                  type="button"
                  spin={this.state.deleting}
                  disabled={this.state.deleting}
                  onClick={() => {
                    this.setState({ deleting: true });
                    selectedAccounts.forEach(accountId =>
                      this.props.onDelete(
                        this.props.list.find(
                          ({ $id: { uuid } }) => uuid.toString() === accountId
                        )
                      )
                    );
                    window.setTimeout(() => {
                      this.setState({ deleting: false, selectedAccounts: {} });
                      this.props.onFetch();
                    }, 1000);
                  }}
                >
                  {this.state.deleting
                    ? `Deleting ${selectedAccounts.length} account(s) ...`
                    : `Delete ${selectedAccounts.length} account(s)`}
                </IconButton>
              </div>
            )}
            {Object.entries(this.props.total).map(([currency, total]) => (
              <div className="card-footer" key={currency}>
                <span>Total ({currency})</span>
                <Money symbol={currency}>{total}</Money>
              </div>
            ))}
          </>
        )}
      </form>
    );
  }
}

ListCheckingAccounts.propTypes = {
  onFetch: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  reports: PropTypes.objectOf(PropTypes.instanceOf(Report)),
  isFetching: PropTypes.bool.isRequired,
  total: PropTypes.objectOf(PropTypes.number).isRequired
};
