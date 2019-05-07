import React from 'react';
import { Card, Table, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Account, Spending } from '../schema';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { FormatDate } from '../util/date/FormatDate';
import { currencies, currenciesById, EUR } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { WithSpendings } from './WithSpendings';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import './Spendings.scss';
import { Info } from '../Account/Info';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

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

type SpendingCategory = {
  spendings: Spending[];
  sums: { [key: string]: number };
  counts: { [key: string]: number };
};

type SpendingsByCategory = {
  [key: string]: SpendingCategory;
};

const SpendingsList = ({
  spendingsByCategory,
  header,
  accountId
}: {
  spendingsByCategory: SpendingsByCategory;
  header: React.ReactElement;
  accountId: string;
}) => (
  <Card>
    {header}
    <Table className="spendings">
      <tbody>
        {Object.keys(spendingsByCategory).map(cat => (
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

export const Spendings = (props: { account: Account }) => {
  const {
    _meta: { id: accountId }
  } = props.account;
  return (
    <WithSpendings {...props} loading={<Loading />}>
      {({ spendings, refetch, next, nextMonth, prevMonth, startDate }) => {
        if (!spendings.length) {
          return (
            <Card>
              <ListingHeader
                title={'Booked'}
                refetch={refetch}
                next={next}
                nextMonth={nextMonth}
                prevMonth={prevMonth}
                startDate={startDate}
              />
              <CardBody>
                <Note>No spendings found.</Note>
              </CardBody>
            </Card>
          );
        }

        const spendingsByCategory = spendings.reduce(
          (spendingsByCategory, spending) => {
            const t = spending.booked ? 'booked' : 'pending';
            if (!spendingsByCategory[t][spending.category]) {
              spendingsByCategory[t][spending.category] = {
                spendings: [],
                sums: {},
                counts: {}
              };
              currencies.forEach(currency => {
                spendingsByCategory[t][spending.category].sums[currency.id] = 0;
                spendingsByCategory[t][spending.category].counts[
                  currency.id
                ] = 0;
              });
            }
            spendingsByCategory[t][spending.category].spendings.push(spending);

            spendingsByCategory[t][spending.category].sums[
              currenciesById.EUR.id
            ] += spending.amount * spending.currency.toEUR;
            if (spending.currency.id !== currenciesById.EUR.id) {
              spendingsByCategory[t][spending.category].sums[
                spending.currency.id
              ] += spending.amount;
            }

            spendingsByCategory[t][spending.category].counts[
              spending.currency.id
            ]++;
            return spendingsByCategory;
          },
          {
            booked: {},
            pending: {}
          } as {
            booked: SpendingsByCategory;
            pending: SpendingsByCategory;
          }
        );

        return (
          <>
            <section>
              <Info account={props.account} />
              {Object.keys(spendingsByCategory.booked).length ? (
                <SpendingsList
                  spendingsByCategory={spendingsByCategory.booked}
                  header={
                    <ListingHeader
                      title={'Booked'}
                      refetch={refetch}
                      next={next}
                      nextMonth={nextMonth}
                      prevMonth={prevMonth}
                      startDate={startDate}
                    />
                  }
                  accountId={accountId}
                />
              ) : null}
            </section>
            <section>
              {Object.keys(spendingsByCategory.pending).length ? (
                <SpendingsList
                  spendingsByCategory={spendingsByCategory.pending}
                  header={
                    <ListingHeader
                      title={'Pending'}
                      refetch={refetch}
                      next={next}
                      nextMonth={nextMonth}
                      prevMonth={prevMonth}
                      startDate={startDate}
                    />
                  }
                  accountId={accountId}
                />
              ) : null}
            </section>
          </>
        );
      }}
    </WithSpendings>
  );
};
