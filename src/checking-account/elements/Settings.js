import * as React from 'react';
import { ListCard as Card } from '../../card/Element';
import PropTypes from 'prop-types';
import { Checkbox } from '../../form/Checkbox';
import { Input } from '../../form/Input';
import { CheckingAccount } from '@ausgaben/models';

import { Icon } from '../../button/Icon';

export class CheckingAccountSettings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currency: props.checkingAccount.currency,
      name: props.checkingAccount.name,
      savings: props.checkingAccount.savings
    };
  }

  isCurrencyValid = () => this.state.currency.length >= 1;
  isNameValid = () => this.state.name.length >= 1;

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
          onChange={savings => this.setState({savings}, () => this.props.onUpdate(this.props.checkingAccount, 'savings', this.state.savings))}
          checked={this.state.savings}
        />
        <Input
          id="currency"
          label="Currency for this checking account"
          placeholder="e.g. '€'"
          value={this.state.currency}
          isValid={this.isCurrencyValid()}
          onChange={currency => this.setState({currency})}
          onBlur={() => this.isCurrencyValid() && this.props.onUpdate(this.props.checkingAccount, 'currency', this.state.currency)}
        />
        <Input
          id="name"
          label="Name for this checking account"
          placeholder="e.g. 'Salary'"
          value={this.state.name}
          isValid={this.isNameValid()}
          onChange={name => this.setState({name})}
          onBlur={() => this.isNameValid() && this.props.onUpdate(this.props.checkingAccount, 'name', this.state.name)}
        />
      </Card>
    );
  }
}

CheckingAccountSettings.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount).isRequired,
  onUpdate: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)),
};
