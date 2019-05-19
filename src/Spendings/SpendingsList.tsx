import React from 'react';
import { Button, Card, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Spending } from '../schema';
import { FormatDate } from '../util/date/FormatDate';
import { currenciesById, EUR } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import './Spendings.scss';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { spendingsQuery } from '../graphql/queries/spendingsQuery';
import { updateAggregate } from '../es/updateAggregate';
import { SpendingsByCategory } from './SpendingsByCategory';

export const markSpendingAsBooked = gql`
  mutation updateSpending($spendingId: ID!) {
    updateSpending(spendingId: $spendingId, booked: true)
  }
`;

class MarkSpendingAsBookedMutation extends Mutation<
  {
    updateSpending: void;
  },
  {
    spendingId: string;
  }
> {}

export const SpendingsList = ({
  spendingsByCategory,
  header,
  accountId,
  variables,
  onUpdateSpendings
}: {
  spendingsByCategory: SpendingsByCategory;
  header: React.ReactElement;
  accountId: string;
  variables: any;
  onUpdateSpendings: (spendings: Spending[]) => void;
}) => (
  <Card>
    {header}
    <Table className="spendings">
      <tbody>
        {Object.keys(spendingsByCategory)
          .sort()
          .map(cat => (
            <React.Fragment key={cat}>
              <tr>
                <th colSpan={3}>{cat}</th>
                {Object.keys(spendingsByCategory[cat].counts)
                  .filter(key => key !== EUR.id)
                  .filter(key => spendingsByCategory[cat].counts[key] > 0)
                  .map(key => (
                    <th key={key} className="amount">
                      <FormatMoney
                        amount={spendingsByCategory[cat].sums[key]}
                        symbol={currenciesById[key].symbol}
                      />
                    </th>
                  ))}
                {Object.keys(spendingsByCategory[cat].counts)
                  .filter(key => key !== EUR.id)
                  .filter(key => spendingsByCategory[cat].counts[key] > 0)
                  .length === 0 && <th />}
                {spendingsByCategory[cat].counts[EUR.id] > 0 && (
                  <th className="amount">
                    <FormatMoney
                      amount={spendingsByCategory[cat].sums[EUR.id]}
                      symbol={currenciesById[EUR.id].symbol}
                    />
                  </th>
                )}
                {spendingsByCategory[cat].counts[EUR.id] === 0 && <th />}
              </tr>
              {spendingsByCategory[cat].spendings.map(
                ({
                  description,
                  bookedAt,
                  amount,
                  booked,
                  _meta: { id },
                  currency: { id: currencyId, toEUR }
                }) => (
                  <tr key={id} className="spending">
                    {!booked && (
                      <td>
                        <MarkSpendingAsBookedMutation
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
                                onUpdateSpendings(spendings);
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
                        </MarkSpendingAsBookedMutation>
                      </td>
                    )}
                    {booked && <td />}
                    <td className="date">
                      <FormatDate date={bookedAt} />
                    </td>
                    <td className="description">
                      <Link to={`/account/${accountId}/spending/${id}`}>
                        {description}
                      </Link>
                    </td>
                    {currencyId !== currenciesById.EUR.id && (
                      <td className="amount">
                        <FormatMoney
                          amount={amount}
                          symbol={currenciesById[currencyId].symbol}
                        />
                      </td>
                    )}
                    {currencyId === currenciesById.EUR.id && <td />}
                    <td className="amount">
                      <FormatMoney
                        amount={amount * toEUR}
                        symbol={currenciesById.EUR.symbol}
                      />
                    </td>
                  </tr>
                )
              )}
            </React.Fragment>
          ))}
      </tbody>
    </Table>
  </Card>
);
