import React from 'react';
import { Connect } from 'aws-amplify-react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Account, Spending } from '../schema';
import {
  month,
  spendingsQuery,
  allTime
} from '../graphql/queries/spendingsQuery';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Query } from 'react-apollo';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { FormatDate } from '../util/date/FormatDate';
import { currencies, currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';

export const Spendings = (props: { account: Account }) => {
  const {
    account: {
      isSavingsAccount,
      _meta: { id: accountId }
    }
  } = props;

  const { startDate, endDate } = isSavingsAccount ? allTime() : month();

  return (
    <Card>
      <Query
        query={spendingsQuery}
        variables={{
          accountId,
          startDate: startDate.toISO(),
          endDate: endDate.toISO()
        }}
      >
        {({ data, loading, error, refetch }: any) => {
          if (error) {
            return (
              <>
                <h3>Error</h3>
                {JSON.stringify(error)}
              </>
            );
          }
          if (loading || !data) return <Loading />;
          if (data.spendings.items.length) {
            const spendings = data.spendings.items as Spending[];
            const spendingsByCategory = spendings.reduce(
              (spendingsByCategory, spending) => {
                if (!spendingsByCategory[spending.category]) {
                  spendingsByCategory[spending.category] = {
                    spendings: [],
                    sums: {}
                  };
                }
                spendingsByCategory[spending.category].spendings.push(spending);
                spendingsByCategory[spending.category].sums = {
                  ['EUR']:
                    (spendingsByCategory[spending.category].sums.EUR || 0) +
                    spending.amount * spending.currency.toEUR,
                  [spending.currency.id]:
                    (spendingsByCategory[spending.category].sums[
                      spending.currency.id
                    ] || 0) + spending.amount
                };
                return spendingsByCategory;
              },
              {} as {
                [key: string]: {
                  spendings: Spending[];
                  sums: { [key: string]: number };
                };
              }
            );
            return (
              <>
                <ListingHeader
                  title={'Spendings'}
                  refetch={refetch}
                  nextStartKey={data.spendings.nextStartKey}
                >
                  <Link to={`/account/${accountId}/new/spending`}>
                    Add Spending
                  </Link>
                </ListingHeader>
                <Table>
                  <tbody>
                    {Object.keys(spendingsByCategory).map(cat => (
                      <React.Fragment key={cat}>
                        <tr>
                          <th colSpan={2}>{cat}</th>
                          <th>
                            <FormatMoney
                              amount={spendingsByCategory[cat].sums.NOK}
                              symbol={currenciesById.NOK.symbol}
                            />
                          </th>
                          <th>
                            <FormatMoney
                              amount={spendingsByCategory[cat].sums.EUR}
                              symbol={currenciesById.EUR.symbol}
                            />
                          </th>
                        </tr>
                        {spendingsByCategory[cat].spendings.map(
                          ({
                            description,
                            bookedAt,
                            amount,
                            _meta: { id },
                            currency: { id: currencyId, toEUR }
                          }) => (
                            <tr key={id}>
                              <td>
                                <FormatDate date={bookedAt} />
                              </td>
                              <td>
                                <Link
                                  to={`/account/${accountId}/spending/${id}`}
                                >
                                  {description}
                                </Link>
                              </td>
                              <td>
                                <FormatMoney
                                  amount={amount}
                                  symbol={currenciesById[currencyId].symbol}
                                />
                              </td>
                              <td>
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
          }
          return (
            <>
              <ListingHeader title={'Spendings'} refetch={refetch}>
                <Link to={`/account/${accountId}/new/spending`}>
                  Add Spending
                </Link>
              </ListingHeader>
              <CardBody>
                <Note>No spendings found.</Note>
              </CardBody>
            </>
          );
        }}
      </Query>
    </Card>
  );
};
