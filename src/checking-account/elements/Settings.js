import * as React from 'react';
import { Card } from '../../card/Element';
import PropTypes from 'prop-types';
import { Checkbox } from '../../form/Checkbox';
import { Input } from '../../form/Input';
import { CheckingAccount } from '@ausgaben/models';

import styles from './Styles.scss';
import { Icon } from '../../button/Icon';

export class CheckingAccountSettings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currency: props.item.currency,
      savings: props.item.savings
    };
  }

  isCurrencyValid = () => this.state.currency.length >= 1;
  isValid = () => {
    return this.isCurrencyValid();
  };

  render () {
    return (
      <Card
        title="Settings"
        errors={this.props.errors}
        icon={<Icon>settings</Icon>}
      >
        <Checkbox
          id="savings"
          label="This is a savings account"
          onChange={savings => this.props.onUpdate(this.props.item, {savings})}
          disabled={this.props.updating.savings}
        />
        <Input
          id="currency"
          label="Currency for this checking account"
          placeholder="e.g. '€'"
          value={this.props.item.currency}
          isValid={this.isCurrencyValid()}
          onChange={currency => this.setState({currency})}
          onBlur={() => this.props.onUpdate(this.props.item, {currency: this.state.currency})}
          disabled={this.props.updating.currency}
        />
      </Card>
    );
  }
}

CheckingAccountSettings.propTypes = {
  item: PropTypes.instanceOf(CheckingAccount).isRequired,
  updating: PropTypes.objectOf(PropTypes.bool).isRequired,
  onUpdate: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)),
};
