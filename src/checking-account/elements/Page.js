import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';
import { CheckingAccountSettings } from './Settings';
import { CheckingAccountSummary } from './Summary';
import { URIValue } from '@rheactorjs/value-objects';

import styles from './Styles.scss';

export class CheckingAccountPage extends React.Component {

  componentWillMount = () => {
    if (!this.props.checkingAccount) {
      this.props.onFetch()
    }
  }

  render = () => {
    if (this.props.error) return <div className="alert alert-danger" role="alert">
      {this.props.error.message}
    </div>
    if (!this.props.checkingAccount) return null;
    return (
      <>
        <CheckingAccountSummary {...this.props} />
        <CheckingAccountSettings {...this.props}/>
      </>
    );
  };
}

CheckingAccountPage.propTypes = {
  onFetch: PropTypes.func.isRequired,
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  report: PropTypes.instanceOf(Report),
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  pending: PropTypes.number.isRequired
};
