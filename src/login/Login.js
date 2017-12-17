import * as React from 'react';
import { Form } from '../form/Form';
import PropTypes from 'prop-types';
import { Input } from '../form/Input';

import styles from './Login.scss';
import { Icon } from '../button/Icon';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      newpassword: '',
      newpassword2: '',
      name: props.name
    };
  }

  isUsernameValid = () => this.state.username.length >= 1;
  isNameValid = () => this.state.name.length >= 1;
  isPasswordValid = password => (password && password.length >= 8) || false;
  isValid = () => {
    if (!this.isUsernameValid()) return false;
    if (!this.isPasswordValid(this.state.password)) return false;
    if (this.props.newPasswordRequired) {
      if (!this.isNameValid()) return false;
      if (!this.isPasswordValid(this.state.newpassword)) return false;
      if (!this.isPasswordValid(this.state.newpassword2)) return false;
      if (this.state.newpassword !== this.state.newpassword2) return false;
    }
    return true;
  };

  render() {
    return (
      <Form
        title="Login"
        onSubmit={() =>
          this.props.onLogin(
            this.state.username,
            this.state.password,
            this.state.newpassword,
            this.state.name
          )
        }
        submitting={this.props.submitting}
        valid={this.isValid()}
        error={this.props.error}
        icon={<Icon>person</Icon>}
      >
        <Input
          id="username"
          label="Username or email address"
          placeholder="Your username, or your email address e.g. 'alex@example.com'"
          isValid={this.isUsernameValid()}
          onChange={username => this.setState({ username })}
          disabled={this.props.submitting}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Your password"
          isValid={this.isPasswordValid(this.state.password)}
          onChange={password => this.setState({ password })}
          disabled={this.props.submitting}
        />
        {this.props.newPasswordRequired && (
          <Input
            id="name"
            type="text"
            label="Enter your name"
            placeholder="e.g. 'Tanja'"
            isValid={this.isNameValid()}
            onChange={name => this.setState({ name })}
            disabled={this.props.submitting}
          />
        )}
        {this.props.newPasswordRequired && (
          <Input
            id="newpassword"
            type="password"
            label="Enter a new password"
            placeholder="Your new password"
            isValid={this.isPasswordValid(this.state.newpassword)}
            onChange={newpassword => this.setState({ newpassword })}
            disabled={this.props.submitting}
          />
        )}
        {this.props.newPasswordRequired && (
          <Input
            id="newpassword2"
            type="password"
            label="Retype the new password"
            placeholder="Your new password"
            isValid={this.isPasswordValid(this.state.newpassword2)}
            onChange={newpassword2 => this.setState({ newpassword2 })}
            disabled={this.props.submitting}
          />
        )}
      </Form>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  newPasswordRequired: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error)
};
