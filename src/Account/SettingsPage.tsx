import React from "react";
import { Settings } from "./Settings";
import { WithAccount } from "../Accounts/WithAccounts";
import { Main } from "../Styles";
import { RouteComponentProps } from "react-router";

export const AccountSettingsPage = (
  props: RouteComponentProps<{
    accountId: string;
  }>
) => (
  <Main>
    <WithAccount accountId={props.match.params.accountId}>
      {(account) => <Settings account={account} />}
    </WithAccount>
  </Main>
);
