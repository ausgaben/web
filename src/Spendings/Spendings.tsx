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

export const Spendings = (props: { account: Account }) => {
  const {
    _meta: { id: accountId }
  } = props.account;
  return (
    <Card>
      <WithSpendings {...props} loading={<Loading />}>
        {({ spendings, refetch, next }) => {
          const spendingsByCategory = spendings.reduce(
            (spendingsByCategory, spending) => {
              if (!spendingsByCategory[spending.category]) {
                spendingsByCategory[spending.category] = {
                  spendings: [],
                  sums: {},
                  counts: {}
                };
                currencies.forEach(currency => {
                  spendingsByCategory[spending.category].sums[currency.id] = 0;
                  spendingsByCategory[spending.category].counts[
                    currency.id
                  ] = 0;
                });
              }
              spendingsByCategory[spending.category].spendings.push(spending);

              spendingsByCategory[spending.category].sums[
                currenciesById.EUR.id
              ] += spending.amount * spending.currency.toEUR;
              if (spending.currency.id !== currenciesById.EUR.id) {
                spendingsByCategory[spending.category].sums[
                  spending.currency.id
                ] += spending.amount;
              }

              spendingsByCategory[spending.category].counts[
                spending.currency.id
              ]++;
              return spendingsByCategory;
            },
            {} as {
              [key: string]: {
                spendings: Spending[];
                sums: { [key: string]: number };
                counts: { [key: string]: number };
              };
            }
          );
          return (
            <>
              <ListingHeader title={'Spendings'} refetch={refetch} next={next}>
                <Link to={`/account/${accountId}/new/spending`}>
                  Add Spending
                </Link>
              </ListingHeader>
              {!spendings.length && (
                <CardBody>
                  <Note>No spendings found.</Note>
                </CardBody>
              )}
              <Table className="spendings">
                <tbody>
                  {Object.keys(spendingsByCategory).map(cat => (
                    <React.Fragment key={cat}>
                      <tr>
                        <th colSpan={2}>{cat}</th>
                        {Object.keys(spendingsByCategory[cat].counts).map(
                          key => {
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
                          }
                        )}
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
            </>
          );
        }}
      </WithSpendings>
    </Card>
  );
};
