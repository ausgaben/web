import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';

import styles from './ListCheckingAccounts.scss';
import { Icon } from '../button/Icon';
import { IconWithText } from '../button/IconWithText';
import { Money } from '../money/Element';

export class ListCheckingAccounts extends React.Component {
  componentDidMount = () => {
    this.props.onFetch();
  };

  render() {
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
        {!this.props.isFetching &&
          this.props.list && (
            <>
              <div className="card-body">These are your checking accounts:</div>
              <ul className="list-group list-group-flush">
                {this.props.list.map(checkingAccount => (
                  <li
                    className="list-group-item sum clickable"
                    key={checkingAccount.$id.uuid.toString()}
                    onClick={() => {
                      this.props.history.push(
                        `/checking-account/${encodeURIComponent(
                          checkingAccount.$id.uuid.toString()
                        )}`
                      );
                    }}
                  >
                    <span>{checkingAccount.name}</span>
                    {this.props.reports[
                      checkingAccount.$id.uuid.toString()
                    ] && (
                      <Money symbol={checkingAccount.currency}>
                        {
                          this.props.reports[
                            checkingAccount.$id.uuid.toString()
                          ].balance
                        }
                      </Money>
                    )}
                  </li>
                ))}
              </ul>
              <table className="table card-footer">
                <tbody>
                  {Object.entries(this.props.total).map(([currency, total]) => (
                    <tr key={currency}>
                      <td>Total ({currency})</td>
                      <td className="money">
                        <Money symbol={currency}>{total}</Money>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
      </form>
    );
  }
}

ListCheckingAccounts.propTypes = {
  onFetch: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  reports: PropTypes.objectOf(PropTypes.instanceOf(Report)),
  isFetching: PropTypes.bool.isRequired,
  total: PropTypes.objectOf(PropTypes.number).isRequired
};
