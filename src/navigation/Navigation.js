import * as React from 'react';
import PropTypes from 'prop-types';

import logo from './logo.svg';
import styles from './Navigation.scss';
import { Icon } from '../button/Icon';
import { userType } from '../login/LoginReducer';
import { IconWithText } from '../button/IconWithText';

export class Navigation extends React.Component {
  componentDidMount = () => {
    this.props.autoLogin();
  };

  render = () => (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="/">
        <img
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Ausgaben"
        />
        <span>Ausgaben</span>
      </a>
      <nav className="navbar-nav">
        {this.props.children}
        {/*
        {((page, checkingAccount) => {
          if (page[0] === "checking-account") {
            return (

            );
          }
          if (page.join("/") === "spending/add") {
            return (

            );
          }
        })(this.props.page, this.props.checkingAccount)}
        */}
        {this.props.user && (
          <a className="btn btn-light" href="/">
            <IconWithText icon={<Icon>account_balance_wallet</Icon>}>
              Accounts
            </IconWithText>
          </a>
        )}
      </nav>
      {this.props.user && (
        <nav className="navbar-nav">
          <button type="button" className="btn btn-light">
            <IconWithText icon={<Icon>person</Icon>}>
              {this.props.user.name}
            </IconWithText>
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={this.props.logout}
          >
            <IconWithText icon={<Icon>power_settings_new</Icon>}>
              Logout
            </IconWithText>
          </button>
        </nav>
      )}
    </nav>
  );
}

Navigation.propTypes = {
  user: userType,
  autoLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};
