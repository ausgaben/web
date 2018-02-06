import * as React from 'react';
import { Form } from '../form/Form';
import PropTypes from 'prop-types';
import { Input } from '../form/Input';
import { Link } from 'react-router-dom';

import styles from './Login.scss';
import { Icon } from '../button/Icon';

const STEP_LOGIN = 'login';
const STEP_RECOVER_PASSWORD = 'recover_password';
const STEP_ENTER_CODE = 'enter_code';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      newpassword: '',
      newpassword2: '',
      name: props.name,
      code: '',
      step: STEP_LOGIN
    };
  }

  isUsernameValid = () => this.state.username.length >= 1;
  isNameValid = () => this.state.name.length >= 1;
  isPasswordValid = password => (password && password.length >= 8) || false;
  isCodeValid = () => /^[0-9]{6}$/.test(this.state.code);
  isValid = () => {
    if (this.isLogin()) {
      if (!this.isUsernameValid()) return false;
      return this.isPasswordValid(this.state.password);
    }
    if (this.isRecoverPassword()) {
      return this.isUsernameValid();
    }
    if (this.isNewPassword()) {
      if (!this.isUsernameValid()) return false;
      if (!this.isNameValid()) return false;
      if (!this.isPasswordValid(this.state.newpassword)) return false;
      if (!this.isPasswordValid(this.state.newpassword2)) return false;
      if (this.state.newpassword !== this.state.newpassword2) return false;
    }
    if (this.isEnterCode()) {
      if (!this.isUsernameValid()) return false;
      if (!this.isPasswordValid(this.state.newpassword)) return false;
      if (!this.isPasswordValid(this.state.newpassword2)) return false;
      if (this.state.newpassword !== this.state.newpassword2) return false;
      return this.isCodeValid();
    }
  };

  isLogin = () => this.state.step === STEP_LOGIN;
  isRecoverPassword = () => this.state.step === STEP_RECOVER_PASSWORD;
  isEnterCode = () => this.state.step === STEP_ENTER_CODE;
  isNewPassword = () => this.props.newPasswordRequired;

  componentWillReceiveProps({ recoverPasswordResult }) {
    if (recoverPasswordResult) {
      this.setState({ step: STEP_ENTER_CODE });
    }
  }

  render() {
    return (
      <Form
        title={(() => {
          switch (this.state.step) {
            case STEP_LOGIN:
              return 'Login';
            case STEP_ENTER_CODE:
              return 'Enter code';
            case STEP_RECOVER_PASSWORD:
              return 'Recover password';
          }
        })()}
        onSubmit={() => {
          if (this.isLogin()) {
            this.props.onLogin({
              username: this.state.username,
              password: this.state.password
            });
          }
          if (this.isNewPassword()) {
            this.props.onLogin({
              username: this.state.username,
              newPassword: this.state.newpassword,
              name: this.state.name
            });
          }
          if (this.isEnterCode()) {
            this.props.onLogin({
              username: this.state.username,
              newPassword: this.state.newpassword,
              code: this.state.code
            });
          }
          if (this.isRecoverPassword()) {
            this.props.onRecoverPassword({ username: this.state.username });
          }
        }}
        submitting={this.props.submitting}
        valid={this.isValid()}
        error={this.props.error}
        icon={<Icon>person</Icon>}
        controls={
          <>
            {this.isLogin() && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => this.setState({ step: STEP_RECOVER_PASSWORD })}
              >
                Lost password?
              </button>
            )}
            {this.isRecoverPassword() && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => this.setState({ step: STEP_ENTER_CODE })}
              >
                Already have a code?
              </button>
            )}
            {this.isEnterCode() && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => this.setState({ step: STEP_LOGIN })}
              >
                Back to login
              </button>
            )}
          </>
        }
      >
        {this.props.recoverPasswordResult && (
          <div className="alert alert-success" role="alert">
            {this.props.recoverPasswordResult.DeliveryMedium === 'EMAIL' && (
              <span>
                Check your email{' '}
                <code>{this.props.recoverPasswordResult.Destination}</code> and
                enter the code below.
              </span>
            )}
            {this.props.recoverPasswordResult.DeliveryMedium === 'SMS' && (
              <span>
                Check your phone{' '}
                <code>{this.props.recoverPasswordResult.Destination}</code> and
                enter the code below.
              </span>
            )}
          </div>
        )}
        <Input
          id="username"
          label="Username or email address"
          placeholder="Your username, or your email address e.g. 'alex@example.com'"
          isValid={this.isUsernameValid()}
          onChange={username => this.setState({ username })}
          disabled={this.props.submitting}
          helpText={
            this.isRecoverPassword() ? (
              <span>
                Enter your username or email address in order to recover your
                password.
              </span>
            ) : null
          }
        />
        {this.isLogin() && (
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Your password"
            isValid={this.isPasswordValid(this.state.password)}
            onChange={password => this.setState({ password })}
            disabled={this.props.submitting}
          />
        )}
        {this.isNewPassword() && (
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
        {(this.isNewPassword() || this.isEnterCode()) && (
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
        {(this.isNewPassword() || this.isEnterCode()) && (
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
        {this.isEnterCode() && (
          <Input
            id="code"
            label="Verification code"
            placeholder="Your verification code, e.g. '1234'"
            isValid={this.isCodeValid()}
            onChange={code => this.setState({ code })}
            disabled={this.props.submitting}
          />
        )}
      </Form>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRecoverPassword: PropTypes.func.isRequired,
  recoverPasswordResult: PropTypes.shape({
    Destination: PropTypes.string.isRequired,
    DeliveryMedium: PropTypes.oneOf(['EMAIL', 'SMS']),
    AttributeName: PropTypes.string.isRequired
  }),
  submitting: PropTypes.bool.isRequired,
  newPasswordRequired: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error)
};
