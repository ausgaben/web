import React from "react";
import { Import } from "./Import";
import { Main } from "../Styles";
import { RouteComponentProps } from "react-router";
import { WithAccount } from "../Accounts/WithAccounts";

export const AccountImportPage = (
  props: RouteComponentProps<{
    accountId: string;
  }>
) => (
  <Main>
    <WithAccount accountId={props.match.params.accountId}>
      {(account) => <Import account={account} />}
    </WithAccount>
  </Main>
);
