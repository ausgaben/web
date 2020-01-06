import React from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Spending, Account } from '../schema';
import { FormatDate } from '../util/date/FormatDate';
import { FormatMoney } from '../util/date/FormatMoney';
import { Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';
import { spendingsQuery } from '../graphql/queries/spendingsQuery';
import { updateAggregate } from '../es/updateAggregate';
import { SpendingsByCategory } from './SpendingsByCategory';
import styled from 'styled-components';
import { mobileBreakpoint } from '../Styles';

export const markSpendingAsBooked = gql`
  mutation updateSpending($spendingId: ID!) {
    updateSpending(spendingId: $spendingId, booked: true)
  }
`;

const Nowrap = styled.span`
  white-space: nowrap;
`;

export const SpendingsTable = styled(Table)`
  tr.spending {
    font-size: 80%;
    @media (min-width: ${mobileBreakpoint}) {
      font-size: 100%;
    }
  }
  td.description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
    width: 100%;
  }
  td.amount,
  th.amount,
  td.date {
    text-align: right;
  }
`;

const Summary = styled.tr`
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

export const SpendingsList = ({
  spendingsByCategory,
  header,
  account,
  variables,
  onUpdateSpendings,
  booked
}: {
  spendingsByCategory: SpendingsByCategory;
  header: React.ReactElement;
  account: Account;
  variables: any;
  onUpdateSpendings: () => void;
  booked: boolean;
}) => {
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

  const totalSumInAccountDefaultCurrency = Object.values(spendingsByCategory)
    .map(({ spendings }) => spendings)
    .flat()
    .reduce(sumSpendings(account), { amount: 0, hasConversion: false });

  return (
    <>
      <Card>
        {header}
        <SpendingsTable>
          <tbody>
            <Summary>
              <td colSpan={booked ? 2 : 3}>
                Total income
                <br />
                - Total spendings
                <br />
                <strong>= Total</strong>
              </td>
              <td className="amount">
                <FormatMoney
                  approximation={
                    totalIncomeInAccountDefaultCurrency.hasConversion
                  }
                  amount={totalIncomeInAccountDefaultCurrency.amount}
                  symbol={account.defaultCurrency.symbol}
                />
                <br />
                <FormatMoney
                  approximation={
                    totalSpendingsInAccountDefaultCurrency.hasConversion
                  }
                  amount={totalSpendingsInAccountDefaultCurrency.amount}
                  symbol={account.defaultCurrency.symbol}
                />
                <br />
                <strong>
                  <Nowrap>
                    =
                    <FormatMoney
                      approximation={
                        totalSumInAccountDefaultCurrency.hasConversion
                      }
                      amount={totalSumInAccountDefaultCurrency.amount}
                      symbol={account.defaultCurrency.symbol}
                    />
                  </Nowrap>
                </strong>
              </td>
            </Summary>
            {Object.keys(spendingsByCategory)
              .sort()
              .map(cat => (
                <React.Fragment key={cat}>
                  <Summary>
                    <th colSpan={booked ? 2 : 3}>{cat}</th>
                    {/* FIXME: Re-implement sum by category */}
                    <th className="amount">
                      <FormatMoney
                        approximation={spendingsByCategory[cat].hasConversion}
                        amount={
                          spendingsByCategory[cat].totalInAccountDefaultCurrency
                        }
                        symbol={account.defaultCurrency.symbol}
                      />
                    </th>
                  </Summary>
                  {spendingsByCategory[cat].spendings.map(
                    ({
                      description,
                      bookedAt,
                      amount,
                      booked,
                      _meta: { id },
                      currency: { id: currencyId, symbol: currencySymbol }
                    }) => (
                      <tr key={id} className="spending">
                        {!booked && (
                          <td>
                            <Mutation<
                              {
                                updateSpending: void;
                              },
                              {
                                spendingId: string;
                              }
                            >
                              mutation={markSpendingAsBooked}
                              update={cache => {
                                const res = cache.readQuery<{
                                  spendings: {
                                    items: Spending[];
                                  };
                                }>({
                                  query: spendingsQuery,
                                  variables
                                });
                                if (res) {
                                  const {
                                    spendings: { items: spendings }
                                  } = res;
                                  const spendingToUpdate = spendings.find(
                                    ({ _meta: { id: u } }) => id === u
                                  );
                                  if (spendingToUpdate) {
                                    spendings[
                                      spendings.indexOf(spendingToUpdate)
                                    ] = updateAggregate<Spending>({
                                      ...spendingToUpdate,
                                      booked: true
                                    });
                                    cache.writeQuery({
                                      query: spendingsQuery,
                                      data: {
                                        ...res,
                                        spendings: {
                                          ...res.spendings,
                                          items: spendings
                                        }
                                      }
                                    });
                                    onUpdateSpendings();
                                  }
                                }
                              }}
                            >
                              {markSpendingAsBooked => (
                                <Button
                                  color="secondary"
                                  outline={true}
                                  onClick={() =>
                                    markSpendingAsBooked({
                                      variables: { spendingId: id }
                                    })
                                  }
                                  title="Mark as booked"
                                >
                                  <span role="img" aria-label="checkmark">
                                    ✓
                                  </span>
                                </Button>
                              )}
                            </Mutation>
                          </td>
                        )}
                        <td className="date">
                          <FormatDate date={bookedAt} />
                        </td>
                        <td className="description">
                          <Link
                            to={`/account/${account._meta.id}/spending/${id}`}
                          >
                            {description}
                          </Link>
                        </td>
                        <td className="amount">
                          <FormatMoney
                            amount={amount}
                            symbol={currencySymbol}
                          />
                        </td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </SpendingsTable>
      </Card>
    </>
  );
};
