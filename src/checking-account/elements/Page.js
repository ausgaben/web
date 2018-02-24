import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount } from '@ausgaben/models';
import { CheckingAccountSettings } from './Settings';
import { URIValue } from '@rheactorjs/value-objects';

import styles from './Styles.scss';

export class CheckingAccountPage extends React.Component {

  componentWillMount = () => {
    if (!this.props.item) {
      this.props.onFetch(this.props.id)
    }
  }

  render = () => {
    if (this.props.error) return <div className="alert alert-danger" role="alert">
      {this.props.error.message}
    </div>
    if (!this.props.item) return null;
    return (
      <>
        <CheckingAccountSettings item={this.props.item} updating={this.props.updatingSettings} onUpdate={this.props.onUpdate}/>
      </>
    );
  };
}

CheckingAccountPage.propTypes = {
  onFetch: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(CheckingAccount),
  id: PropTypes.instanceOf(URIValue).isRequired,
  updatingSettings: PropTypes.objectOf(PropTypes.bool).isRequired,
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
};
