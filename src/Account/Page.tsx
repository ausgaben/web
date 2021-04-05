import React from "react";
import { Spendings } from "../Spendings/Spendings";
import styled from "styled-components";
import { wideBreakpoint } from "../Styles";
import { Main } from "../Styles";
import { RouteComponentProps } from "react-router";
import { WithAccount } from "../Accounts/WithAccounts";

const AccountMain = styled(Main)`
  @media (min-width: ${wideBreakpoint}) {
    max-width: ${wideBreakpoint};
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1rem;
  }
`;

export const AccountPage = (
  props: RouteComponentProps<{
    accountId: string;
  }>
) => (
  <AccountMain>
    <WithAccount accountId={props.match.params.accountId}>
      {(account) => <Spendings account={account} />}
    </WithAccount>
  </AccountMain>
);
