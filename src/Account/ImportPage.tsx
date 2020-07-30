import React from "react";
import { Import } from "./Import";
import { WithAccount } from "../Accounts/WithAccount";
import { Main } from "../Styles";

export const AccountImportPage = (props: any) => (
  <Main>
    <WithAccount {...props}>
      {(account) => <Import account={account} />}
    </WithAccount>
  </Main>
);
