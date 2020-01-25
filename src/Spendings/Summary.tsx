import React from 'react';
import { Spending, Account } from '../schema';
import { FormatMoney } from '../util/date/FormatMoney';
import { SpendingsByCategory } from './SpendingsByCategory';
import styled from 'styled-components';
import { mobileBreakpoint } from '../Styles';

const Nowrap = styled.span`
  white-space: nowrap;
`;

export const SummaryRow = styled.tr`
  font-size: 90%;
  @media (min-width: ${mobileBreakpoint}) {
    font-size: 100%;
  }
`;

const sumSpendings = (account: Account) => (
  total: { amount: number; hasConversion: boolean },
  {
    amountInAccountDefaultCurrency,
    currency: { id: currencyId }
  }: Spending & { amountInAccountDefaultCurrency: number }
) => ({
  amount: total.amount + amountInAccountDefaultCurrency,
  hasConversion:
    total.hasConversion || account.defaultCurrency.id !== currencyId
});

export type SummaryInfo = { amount: number; hasConversion: boolean };
export type AccountSummary = {
  totalSpendingsInAccountDefaultCurrency: SummaryInfo;
  totalIncomeInAccountDefaultCurrency: SummaryInfo;
  totalSumInAccountDefaultCurrency: SummaryInfo;
  totalPendingInAccountDefaultCurrency?: SummaryInfo;
};

export const summarizeSpendings = ({
  spendingsByCategory,
  account,
  totalPendingInAccountDefaultCurrency
}: {
  spendingsByCategory: SpendingsByCategory;
  account: Account;
  totalPendingInAccountDefaultCurrency?: SummaryInfo;
}): AccountSummary => {
  const totalSpendingsInAccountDefaultCurrency = Object.values(
    spendingsByCategory
  )
    .map(({ spendings }) => spendings)
    .flat()
    .filter(({ amount }) => amount < 0)
    .reduce(sumSpendings(account), { amount: 0, hasConversion: false });

  const totalIncomeInAccountDefaultCurrency = Object.values(spendingsByCategory)
    .map(({ spendings }) => spendings)
    .flat()
    .filter(({ amount }) => amount > 0)
    .reduce(sumSpendings(account), { amount: 0, hasConversion: false });

  let totalSumInAccountDefaultCurrency = Object.values(spendingsByCategory)
    .map(({ spendings }) => spendings)
    .flat()
    .reduce(sumSpendings(account), { amount: 0, hasConversion: false });

  if (totalPendingInAccountDefaultCurrency) {
    totalSumInAccountDefaultCurrency = {
      hasConversion:
        totalSumInAccountDefaultCurrency.hasConversion ||
        totalPendingInAccountDefaultCurrency.hasConversion,
      amount:
        totalSumInAccountDefaultCurrency.amount +
        totalPendingInAccountDefaultCurrency.amount
    };
  }

  return {
    totalSpendingsInAccountDefaultCurrency,
    totalIncomeInAccountDefaultCurrency,
    totalPendingInAccountDefaultCurrency,
    totalSumInAccountDefaultCurrency
  };
};

export const Summary = ({
  booked,
  summary,
  account
}: {
  booked: boolean;
  summary: AccountSummary;
  account: Account;
}) => {
  const {
    totalPendingInAccountDefaultCurrency,
    totalIncomeInAccountDefaultCurrency,
    totalSpendingsInAccountDefaultCurrency,
    totalSumInAccountDefaultCurrency
  } = summary;
  return (
    <SummaryRow>
      <td colSpan={booked ? 2 : 3}>
        Total income
        <br />
        - Total spendings
        <br />
        {totalPendingInAccountDefaultCurrency && (
          <>
            - Total pending
            <br />
          </>
        )}
        <strong>= Total</strong>
      </td>
      <td className="amount">
        <FormatMoney
          approximation={totalIncomeInAccountDefaultCurrency.hasConversion}
          amount={totalIncomeInAccountDefaultCurrency.amount}
          symbol={account.defaultCurrency.symbol}
        />
        <br />
        <FormatMoney
          approximation={totalSpendingsInAccountDefaultCurrency.hasConversion}
          amount={totalSpendingsInAccountDefaultCurrency.amount}
          symbol={account.defaultCurrency.symbol}
        />
        <br />
        {totalPendingInAccountDefaultCurrency && (
          <>
            <FormatMoney
              approximation={totalPendingInAccountDefaultCurrency.hasConversion}
              amount={totalPendingInAccountDefaultCurrency.amount}
              symbol={account.defaultCurrency.symbol}
            />
            <br />
          </>
        )}
        <strong>
          <Nowrap>
            =
            <FormatMoney
              approximation={totalSumInAccountDefaultCurrency.hasConversion}
              amount={totalSumInAccountDefaultCurrency.amount}
              symbol={account.defaultCurrency.symbol}
            />
          </Nowrap>
        </strong>
      </td>
    </SummaryRow>
  );
};
