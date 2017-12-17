import * as React from 'react';
import { Form } from '../form/Form';
import PropTypes from 'prop-types';
import { Input } from '../form/Input';

import styles from './AddAccount.scss';
import { Icon } from '../button/Icon';

export class AddAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  isNameValid = () => this.state.name.length >= 1;
  isValid = () => {
    return this.isNameValid();
  };

  render() {
    return (
      <Form
        title="add account"
        onSubmit={() => this.props.onAddAccount(this.state.name)}
        submitting={this.props.submitting}
        valid={this.isValid()}
        error={this.props.error}
        icon={<Icon>add_circle_outline</Icon>}
      >
        <Input
          id="name"
          label="Name of the the account"
          placeholder="e.g. 'Salary Account'"
          isValid={this.isNameValid()}
          onChange={name => this.setState({ name })}
          disabled={this.props.submitting}
        />
      </Form>
    );
  }
}

AddAccount.propTypes = {
  onAddAccount: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error)
};
