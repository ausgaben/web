import React from 'react';
import { Card, Table, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Account, Spending } from '../schema';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { FormatDate } from '../util/date/FormatDate';
import { currencies, currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { WithSpendings } from './WithSpendings';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import './Spendings.scss';
import { Info } from '../Account/Info';

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
              <th colSpan={2}>{cat}</th>
              {Object.keys(spendingsByCategory[cat].counts).map(key => {
                if (spendingsByCategory[cat].counts[key] > 0) {
                  return (
                    <th key={key} className="amount">
                      <FormatMoney
                        amount={spendingsByCategory[cat].sums[key]}
                        symbol={currenciesById[key].symbol}
                      />
                    </th>
                  );
                }
                return null;
              })}
            </tr>
            {spendingsByCategory[cat].spendings.map(
              ({
                description,
                bookedAt,
                amount,
                _meta: { id },
                currency: { id: currencyId, toEUR }
              }) => (
                <tr key={id} className="spending">
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
      {({ spendings, refetch, next }) => {
        if (!spendings.length) {
          return (
            <Card>
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
