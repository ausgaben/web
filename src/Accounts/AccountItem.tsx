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
import { currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { DateTime } from 'luxon';

export const AccountItem = (props: { account: Account }) => {
  const {
    account: {
      name,
      isSavingsAccount,
      _meta: { id: accountId }
    }
  } = props;

  const { startDate, endDate } = isSavingsAccount ? allTime() : month();

  return (
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
          const hasNOK = spendings.find(({ currency: { id } }) => id === 'NOK');
          const sums = spendings.reduce(
            (sums, spending) => ({
              EUR: sums.EUR + spending.amount * spending.currency.toEUR,
              NOK:
                sums.NOK +
                (spending.currency.id === 'NOK' ? spending.amount : 0)
            }),
            { EUR: 0, NOK: 0 }
          );
          return (
            <tr>
              <td colSpan={isSavingsAccount && !hasNOK ? 2 : 1}>
                <Link to={`/account/${accountId}`}>{name}</Link>
              </td>
              {isSavingsAccount && hasNOK && (
                <td>
                  <FormatMoney
                    amount={sums.NOK}
                    symbol={currenciesById.NOK.symbol}
                  />
                </td>
              )}
              <td>
                {isSavingsAccount && (
                  <FormatMoney
                    amount={sums.EUR}
                    symbol={currenciesById.EUR.symbol}
                  />
                )}
              </td>
            </tr>
          );
        }
      }}
    </Query>
  );
};
