import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';
import { Link } from 'react-router-dom';

import styles from './ListCheckingAccounts.scss';
import { Icon } from '../button/Icon';
import { IconWithText } from '../button/IconWithText';

const Money = ({ value }) => <span className="money">{`${value} €`}</span>;

export class ListCheckingAccounts extends React.Component {
  componentDidMount = () => {
    this.props.onFetchs();
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
                  <Link
                    to={`/checking-account?id=${encodeURIComponent(
                      checkingAccount.$id
                    )}`}
                    key={checkingAccount.$id}
                  >
                    <li className="list-group-item sum">
                      <span>{checkingAccount.name}</span>
                      {this.props.reports[checkingAccount.$id.toString()] && (
                        <Money
                          value={
                            this.props.reports[checkingAccount.$id.toString()]
                              .balance
                          }
                        />
                      )}
                    </li>
                  </Link>
                ))}
              </ul>
              <div className="card-footer sum">
                <span>Total</span>
                <Money value={this.props.total} />
              </div>
            </>
          )}
      </form>
    );
  }
}

ListCheckingAccounts.propTypes = {
  onFetchs: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  reports: PropTypes.objectOf(PropTypes.instanceOf(Report)),
  isFetching: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired
};
