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
        {((page, checkingAccount) => {
          switch (page) {
            case 'checking-account':
              return (
                <a
                  className="btn btn-light"
                  onClick={() => {
                    this.props.history.push('/spending/add');
                  }}
                >
                  <IconWithText icon={<Icon>add_circle_outline</Icon>}>
                    Add spending
                  </IconWithText>
                </a>
              );
            case 'spending/add':
              return (
                <a
                  className="btn btn-light"
                  onClick={() => {
                    this.props.history.push(
                      `/checking-account?id=${encodeURIComponent(
                        checkingAccount.$id
                      )}`
                    );
                  }}
                >
                  <IconWithText icon={<Icon>account_balance_wallet</Icon>}>
                    <span>{checkingAccount.name}</span>
                  </IconWithText>
                </a>
              );
          }
        })(this.props.page, this.props.checkingAccount)}
        <a className="btn btn-light" href="/">
          <IconWithText icon={<Icon>account_balance_wallet</Icon>}>
            Accounts
          </IconWithText>
        </a>
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
  page: PropTypes.string.isRequired,
  checkingAccount: PropTypes.object,
  autoLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};
