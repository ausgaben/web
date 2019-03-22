import * as React from 'react';
import { Component } from 'react';
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
import { CreateAccountsPage } from './CreateAccount/Page';
import { AccountPage } from './Account/Page';
import { AccountSettingsPage } from './Account/SettingsPage';
import { ApolloProvider } from 'react-apollo';
import { createClient } from './Apollo/createClient';

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

class App extends Component<{}, { navigationVisible: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      navigationVisible: false
    };
  }

  logout = async () => {
    await Auth.signOut();
    window.location.reload();
  };

  toggleNavigation = () => {
    this.setState({ navigationVisible: !this.state.navigationVisible });
  };

  render() {
    return (
      <Router>
        <header>
          <Navbar color="light" light>
            <NavbarBrand href="/">Ausgaben</NavbarBrand>
            <NavbarToggler onClick={() => this.toggleNavigation()} />
            <Collapse isOpen={this.state.navigationVisible} navbar>
              <Nav navbar>
                <NavItem>
                  <Link className="nav-link" to="/accounts">
                    Accounts
                  </Link>
                </NavItem>
                <NavItem>
                  <Button onClick={() => this.logout()} outline color="danger">
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
            <Route exact path="/new/account" component={CreateAccountsPage} />
            <Route exact path="/account/:uuid" component={AccountPage} />
            <Route
              exact
              path="/account/:uuid/settings"
              component={AccountSettingsPage}
            />
          </ApolloProvider>
        </main>
      </Router>
    );
  }
}

export default withAuthenticator(App);
