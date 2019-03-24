import React, { useState } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
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
import { AddAccountSpendingPage } from './Account/AddAccountSpendingPage';
import { Page as SpendingPage } from './Spending/Page';

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

const App = () => {
  const [navigationVisible, setNavigationVisible] = useState(false);

  const toggleNavigation = () => setNavigationVisible(!navigationVisible);

  const logout = async () => {
    await Auth.signOut();
    window.location.reload();
  };

  return (
    <Router>
      <header>
        <Navbar color="light" light>
          <NavbarBrand href="/">Ausgaben</NavbarBrand>
          <NavbarToggler onClick={() => toggleNavigation()} />
          <Collapse isOpen={navigationVisible} navbar>
            <Nav navbar>
              <NavItem>
                <Link
                  className="nav-link"
                  to="/accounts"
                  onClick={() => toggleNavigation()}
                >
                  Accounts
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  className="nav-link"
                  to="/about"
                  onClick={() => toggleNavigation()}
                >
                  About
                </Link>
              </NavItem>
              <NavItem>
                <Button onClick={() => logout()} outline color="danger">
                  Log out
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
      <main>
        <ApolloProvider client={client}>
          <Route exact path="/" render={() => <Redirect to="/accounts" />} />
          <Route exact path="/accounts" component={AccountsPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/new/account" component={CreateAccountsPage} />
          <Route exact path="/account/:id" component={AccountPage} />
          <Route
            exact
            path="/account/:id/settings"
            component={AccountSettingsPage}
          />
          <Route
            exact
            path="/account/:id/new/spending"
            component={AddAccountSpendingPage}
          />
          <Route
            exact
            path="/account/:accountId/spending/:spendingId"
            component={SpendingPage}
          />
        </ApolloProvider>
      </main>
    </Router>
  );
};

export default withAuthenticator(App);
