import React, { useState, useEffect } from "react";
import { withAuthenticator } from "aws-amplify-react";
import Amplify, { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  NavbarToggler,
  Collapse,
} from "reactstrap";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { AccountsPage } from "./Accounts/Page";
import { AboutPage } from "./About/Page";
import { CreateAccountsPage } from "./CreateAccount/Page";
import { AccountPage } from "./Account/Page";
import { AccountSettingsPage } from "./Account/SettingsPage";
import { ApolloProvider } from "react-apollo";
import { createClient } from "./Apollo/createClient";
import {
  AddSpendingPage,
  UpdatedSpendingPage,
} from "./Account/AccountSpendingPage";
import { Page as SpendingPage } from "./Spending/Page";
import { Page as ExchangeRatesPage } from "./ExchangeRates/Page";
import logo from "./logo.svg";
import { AccountImportPage } from "./Account/ImportPage";
import styled from "styled-components";
import { GlobalStyle, mobileBreakpoint, wideBreakpoint } from "./Styles";
import { BootstrapStyles } from "./BootstrapStyles";
import * as Sentry from "@sentry/browser";

import "@aws-amplify/ui/dist/style.css";

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITYPOOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USERPOOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USERPOOL_WEBCLIENT_ID,
    mandatorySignIn: true,
  },
});

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
const netlifyCommitRef = process.env.COMMIT_REF;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    ...(netlifyCommitRef ? { release: netlifyCommitRef } : {}),
  });
}
export const client = createClient();

export const AuthDataContext = React.createContext<{ identityId?: string }>({});

const Navigation = (props: {
  navbar?: boolean;
  logout: () => void;
  onClick?: () => void;
}) => {
  const { navbar, logout, onClick, ...restProps } = props;
  return (
    <Nav navbar={navbar} {...restProps}>
      <NavItem>
        <Link className="nav-link" to="/accounts" onClick={onClick}>
          Accounts
        </Link>
      </NavItem>
      <NavItem>
        <Link className="nav-link" to="/exchange-rates" onClick={onClick}>
          Exchange Rates
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

const DesktopNavigation = styled(Navigation)`
  display: none;
  @media (min-width: ${mobileBreakpoint}) {
    display: flex;
  }
`;

const MobileNavigation = styled(Navigation)`
  display: flex;
  .nav-item,
  button {
    align-self: flex-end;
  }
`;

const HideOnMobile = styled.div`
  text-align: right;
  @media (min-width: ${mobileBreakpoint}) {
    display: none;
  }
`;

const StyledNavbar = styled(Navbar)`
  align-items: baseline;
  @media (min-width: ${wideBreakpoint}) {
    max-width: $wide-breakpoint;
    margin: 0 auto;
  }
`;

const Logo = styled.img`
  margin-right: 0.25rem;
`;

const App = ({ authData }: { authData: CognitoUser }) => {
  const [identityId, setIdentityId] = useState<string>();

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
      <GlobalStyle />
      <BootstrapStyles />
      <header className="bg-light">
        <StyledNavbar color="light" light>
          <NavbarBrand href="/">
            <Logo
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Ausgaben"
            />
            Ausgaben
          </NavbarBrand>
          <HideOnMobile>
            <NavbarToggler onClick={toggleNavigation} />
            <Collapse isOpen={navigationVisible} navbar>
              <MobileNavigation
                navbar={true}
                onClick={toggleNavigation}
                logout={logout}
              />
            </Collapse>
          </HideOnMobile>
          <DesktopNavigation onClick={toggleNavigation} logout={logout} />
        </StyledNavbar>
      </header>
      <AuthDataContext.Provider value={{ identityId }}>
        <ApolloProvider client={client}>
          <Route exact path="/" render={() => <Redirect to="/accounts" />} />
          <Route exact path="/accounts" component={AccountsPage} />
          <Route exact path="/exchange-rates" component={ExchangeRatesPage} />
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
            component={UpdatedSpendingPage}
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
