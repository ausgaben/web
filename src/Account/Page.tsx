import React from 'react';
import { Spendings } from '../Spendings/Spendings';
import { WithAccount } from '../Accounts/WithAccount';
import styled from 'styled-components';
import { wideBreakpoint } from '../Styles';
import { Main } from '../Styles';

const AccounMain = styled(Main)`
  @media (min-width: ${wideBreakpoint}) {
    max-width: ${wideBreakpoint};
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1rem;
  }
`;

export const AccountPage = (props: any) => (
  <AccounMain>
    <WithAccount {...props}>
      {account => <Spendings account={account} />}
    </WithAccount>
  </AccounMain>
);
