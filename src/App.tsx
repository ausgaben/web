import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  NavbarToggler,
  Collapse
} from 'reactstrap';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { AccountsPage } from './Accounts/Page';
import { AboutPage } from './About/Page';
import { CreateAccountsPage } from './CreateAccount/Page';
import { AccountPage } from './Account/Page';
import { AccountSettingsPage } from './Account/SettingsPage';
import { ApolloProvider } from 'react-apollo';
import { createClient } from './Apollo/createClient';
import {
  AddSpendingPage,
  EditSpendingPage
} from './Account/AccountSpendingPage';
import { Page as SpendingPage } from './Spending/Page';
import logo from './logo.svg';
import './App.scss';
import { AccountImportPage } from './Account/ImportPage';

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITYPOOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USERPOOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USERPOOL_WEBCLIENT_ID,
    mandatorySignIn: true
  }
});

export const client = createClient();

export const AuthDataContext = React.createContext<{ identityId?: string }>({});

const Navigation = (props: {
  navbar?: boolean;
  logout: () => void;
  onClick?: () => void;
  className?: string;
}) => {
  const { navbar, logout, onClick } = props;
  return (
    <Nav navbar={navbar} className={props.className}>
      <NavItem>
        <Link className="nav-link" to="/accounts" onClick={onClick}>
          Accounts
        </Link>
      </NavItem>
      <NavItem>
        <Link className="nav-link" to="/about" onClick={onClick}>
          About
        </Link>
      </NavItem>
      <NavItem>
        <Button onClick={logout} outline color="danger">
          Log out
        </Button>
      </NavItem>
    </Nav>
  );
};

const App = ({ authData }: { authData: CognitoUser }) => {
  const [identityId, setIdentityId] = useState();

  useEffect(() => {
    Auth.currentCredentials().then(({ identityId }) => {
      setIdentityId(identityId);
    });
  });

  const [navigationVisible, setNavigationVisible] = useState(false);

  const toggleNavigation = () => setNavigationVisible(!navigationVisible);

  const logout = async () => {
    await Auth.signOut();
    window.location.reload();
  };

  return (
    <Router>
      <header className="bg-light">
        <Navbar color="light" light>
          <NavbarBrand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Ausgaben"
            />
            Ausgaben
          </NavbarBrand>
          <NavbarToggler onClick={toggleNavigation} className="hideOnDesktop" />
          <Collapse isOpen={navigationVisible} navbar className="hideOnDesktop">
            <Navigation
              navbar={true}
              onClick={toggleNavigation}
              logout={logout}
            />
          </Collapse>
          <Navigation
            className="showOnDesktop"
            onClick={toggleNavigation}
            logout={logout}
          />
        </Navbar>
      </header>
      <AuthDataContext.Provider value={{ identityId }}>
        <ApolloProvider client={client}>
          <Route exact path="/" render={() => <Redirect to="/accounts" />} />
          <Route exact path="/accounts" component={AccountsPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/new/account" component={CreateAccountsPage} />
          <Route exact path="/account/:accountId" component={AccountPage} />
          <Route
            exact
            path="/account/:accountId/settings"
            component={AccountSettingsPage}
          />
          <Route
            exact
            path="/account/:accountId/import"
            component={AccountImportPage}
          />
          <Route
            exact
            path="/account/:accountId/new/spending"
            component={AddSpendingPage}
          />
          <Route
            exact
            path="/account/:accountId/spending/:spendingId/edit"
            component={EditSpendingPage}
          />
          <Route
            exact
            path="/account/:accountId/spending/:spendingId"
            component={SpendingPage}
          />
        </ApolloProvider>
      </AuthDataContext.Provider>
    </Router>
  );
};

export default withAuthenticator(App);
