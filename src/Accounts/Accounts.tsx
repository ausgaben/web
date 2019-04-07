import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Table } from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Link } from 'react-router-dom';
import './Accounts.scss';
import { Account, Spending } from '../schema';
import { Query } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { AccountItem } from './AccountItem';
import { FormatMoney } from '../util/date/FormatMoney';
import { currenciesById } from '../currency/currencies';
import { client } from '../App';
import { allTime, spendingsQuery } from '../graphql/queries/spendingsQuery';

export const Accounts = () => {
  const [accounts, setAccounts] = useState([] as Account[]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    const { startDate, endDate } = allTime();
    setTotalSavings(
      accounts
        .filter(({ isSavingsAccount }) => isSavingsAccount)
        .map(account =>
          client.readQuery({
            query: spendingsQuery,
            variables: {
              accountId: account._meta.id,
              startDate: startDate.toISO(),
              endDate: endDate.toISO()
            }
          })
        )
        .map(({ spendings: { items } }) => items as Spending[])
        .reduce(
          (sum, spendings) =>
            sum +
            spendings.reduce(
              (sum, spending) =>
                sum + spending.amount * spending.currency.toEUR,
              0
            ),
          0
        )
    );
  });

  return (
    <Card>
      <Query query={accountsQuery}>
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
          if (data.accounts.items.length) {
            const accounts = data.accounts.items as Account[];
            accounts.sort(({ name: a }, { name: b }) => a.localeCompare(b));
            accounts.sort(({ isSavingsAccount }) =>
              isSavingsAccount ? 1 : -1
            );
            setAccounts(accounts);

            return (
              <>
                <ListingHeader
                  title={'Accounts'}
                  refetch={refetch}
                  next={
                    data.accounts.nextStartKey
                      ? () =>
                          refetch({
                            startKey: data.accounts.nextStartKey
                          })
                      : undefined
                  }
                >
                  <Link to="/new/account">Add account</Link>
                </ListingHeader>
                <Table className="accounts">
                  <tbody>
                    {accounts.map(account => (
                      <AccountItem key={account._meta.id} account={account} />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={2}>Total</th>
                      <th className="amount">
                        <FormatMoney
                          amount={totalSavings}
                          symbol={currenciesById.EUR.symbol}
                        />
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </>
            );
          }
          return (
            <>
              <ListingHeader refetch={refetch} title={'Accounts'}>
                <Link to="/new/account">Add account</Link>
              </ListingHeader>
              <CardBody>
                <Note>No accounts found.</Note>
              </CardBody>
            </>
          );
        }}
      </Query>
    </Card>
  );
};
