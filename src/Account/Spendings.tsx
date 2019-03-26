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
import { spendingsQuery } from '../graphql/queries/spendingsQuery';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Query } from 'react-apollo';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { FormatDate } from '../util/date/FormatDate';
import { currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { DateTime } from 'luxon';

export const Spendings = (props: { account: Account }) => {
  const {
    account: {
      _meta: { id: accountId }
    }
  } = props;

  const startOfMonth = DateTime.local().startOf('month');
  const endOfMonth = startOfMonth.endOf('month');

  return (
    <Card>
      <Query
        query={spendingsQuery}
        variables={{
          accountId,
          startDate: startOfMonth.toISO(),
          endDate: endOfMonth.toISO()
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
                  spendingsByCategory[spending.category] = [];
                }
                spendingsByCategory[spending.category].push(spending);
                return spendingsByCategory;
              },
              {} as { [key: string]: Spending[] }
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
                          <th colSpan={3}>{cat}</th>
                        </tr>
                        {spendingsByCategory[cat].map(
                          ({
                            description,
                            bookedAt,
                            amount,
                            _meta: { id },
                            currency: { id: currencyId }
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
