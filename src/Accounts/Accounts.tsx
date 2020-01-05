import React, { useEffect, useState } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Link } from 'react-router-dom';
import { Account, Spending, Currency } from '../schema';
import {
  accountsQuery,
  Accounts as AccountsQueryResult,
  toAccount
} from '../graphql/queries/accountsQuery';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { FormatMoney } from '../util/date/FormatMoney';
import { currenciesById, EUR } from '../currency/currencies';
import { client } from '../App';
import { allTime, spendingsQuery } from '../graphql/queries/spendingsQuery';
import styled from 'styled-components';
import { mobileBreakpoint } from '../Styles';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {
  exchangeRateQuery,
  ExchangeRate
} from '../graphql/queries/exchangeRateQuery';

const AccountsTable = styled(Table)`
  .amount {
    text-align: right;
  }
  tbody,
  tfoot {
    font-size: 80%;
    @media (min-width: ${mobileBreakpoint}) {
      font-size: 100%;
    }
  }
`;

const exchangeconversionRates: { [key: string]: Promise<number> } = {};
const fetchExchangeRate = (
  client: ApolloClient<NormalizedCacheObject>
) => async (currency: Currency, date: Date): Promise<number> => {
  const k = `${currency.id}-${date.toISOString().substring(0, 10)}`;
  if (!exchangeconversionRates[k]) {
    exchangeconversionRates[k] = client
      .query<ExchangeRate>({
        query: exchangeRateQuery,
        fetchPolicy: 'cache-first',
        variables: { currencyId: currency.id, date: date.toISOString() }
      })
      .then(res => res.data.exchangeRate.rate);
  }
  return exchangeconversionRates[k];
};

type AccountTotal = {
  totalSavingsInEUR: number;
  hasConversion: boolean;
};

// NOTE: It is assumed that in savings accounts, there is only one currency
const totalAccountSavingsInEUR = (
  client: ApolloClient<NormalizedCacheObject>
) => async (account: Account): Promise<AccountTotal> => {
  const { startDate, endDate } = allTime();
  const res = client.readQuery<{ spendings: { items: Spending[] } }>({
    query: spendingsQuery,
    variables: {
      accountId: account._meta.id,
      startDate: startDate.toISO(),
      endDate: endDate.toISO()
    }
  });

  const total: AccountTotal = {
    totalSavingsInEUR: 0,
    hasConversion: false
  };

  if (!res) return total;

  // Warn if multiple currencies
  const currencies = res.spendings.items.reduce(
    (currencies, { currency: { id } }) => ({
      ...currencies,
      [id]: true
    }),
    {} as { [key: string]: boolean }
  );
  if (Object.keys(currencies).length > 1) {
    console.error(
      `Account ${account.name} (${
        account._meta.id
      }) has spendings with multiple (${
        Object.keys(currencies).length
      }) currencies!`
    );
    console.error(
      'This will make the total for this account inaccurate. Returning 0.'
    );
    return total;
  }

  const totalInAccountCurrency = res.spendings.items.reduce(
    (total, spending) => {
      if (spending.currency.id !== EUR.id) {
        total.hasNonEUR = true;
      }
      total.totalSavings += spending.amount;
      return total;
    },
    { totalSavings: 0, hasNonEUR: false }
  );

  if (!totalInAccountCurrency.hasNonEUR) {
    return {
      hasConversion: false,
      totalSavingsInEUR: totalInAccountCurrency.totalSavings
    };
  }

  const er = fetchExchangeRate(client);

  const exchangeRate = await er(
    currenciesById[Object.keys(currencies)[0]] as Currency,
    new Date()
  );

  return {
    hasConversion: true,
    totalSavingsInEUR: totalInAccountCurrency.totalSavings * exchangeRate
  };
};

export const Accounts = () => {
  const [accounts, setAccounts] = useState<{
    items: {
      totalSavingsInEUR?: AccountTotal;
      account: Account;
    }[];
    nextStartKey?: any;
  }>({ items: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [nextStartKey, setNextStartKey] = useState<any>();

  useEffect(() => {
    const totalAccountSavings = totalAccountSavingsInEUR(client);

    client
      .query<AccountsQueryResult>({
        query: accountsQuery,
        fetchPolicy: 'cache-first',
        variables: {
          startKey: nextStartKey
        }
      })
      .then(
        async ({
          data: {
            accounts: { items, nextStartKey }
          }
        }) => {
          const savingsAccountsWithTotalsInEUR = [] as {
            totalSavingsInEUR: AccountTotal;
            account: Account;
          }[];

          await items
            .filter(({ isSavingsAccount }) => isSavingsAccount)
            .reduce(
              (p, accountItem) =>
                p.then(async () => {
                  const account = toAccount(accountItem);
                  const total = await totalAccountSavings(account);
                  savingsAccountsWithTotalsInEUR.push({
                    totalSavingsInEUR: total,
                    account
                  });
                }),
              Promise.resolve()
            );

          setAccounts({
            items: [
              ...items
                .filter(({ isSavingsAccount }) => !isSavingsAccount)
                .map(accountItem => ({
                  account: toAccount(accountItem)
                })),
              ...savingsAccountsWithTotalsInEUR
            ],
            nextStartKey
          });
          setLoading(false);
        }
      )
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [nextStartKey]);

  return (
    <Card>
      {loading && <Loading />}
      {!loading && accounts.items.length === 0 && (
        <>
          <ListingHeader
            refetch={() => {
              // FIXME: Implement
              setNextStartKey(undefined);
            }}
            title={'Accounts'}
          >
            <Link to="/new/account">Add account</Link>
          </ListingHeader>
          <CardBody>
            <Note>No accounts found.</Note>
          </CardBody>
        </>
      )}
      {!loading && accounts.items.length && (
        <>
          <ListingHeader
            title={'Accounts'}
            refetch={() => {
              // FIXME: Implement
              setNextStartKey(undefined);
            }}
            next={() => {
              setNextStartKey(accounts.nextStartKey);
            }}
          >
            <Link to="/new/account">Add account</Link>
          </ListingHeader>
          <AccountsTable>
            <tbody>
              {accounts.items.map(({ account, totalSavingsInEUR }) => (
                <tr key={account._meta.id}>
                  <td>
                    <Link to={`/account/${account._meta.id}`}>
                      {account.name}
                    </Link>
                  </td>
                  {account.isSavingsAccount && totalSavingsInEUR && (
                    <td className="amount">
                      <FormatMoney
                        approximation={totalSavingsInEUR.hasConversion}
                        amount={totalSavingsInEUR.totalSavingsInEUR}
                        symbol={currenciesById.EUR.symbol}
                      />
                    </td>
                  )}
                  {!account.isSavingsAccount && <td className="amount">—</td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th className="amount">
                  <FormatMoney
                    approximation={accounts.items.reduce(
                      (hasConversion, { totalSavingsInEUR }) =>
                        hasConversion
                          ? true
                          : totalSavingsInEUR?.hasConversion ?? false,
                      false as boolean
                    )}
                    amount={accounts.items.reduce(
                      (sum, { totalSavingsInEUR }) =>
                        sum + (totalSavingsInEUR?.totalSavingsInEUR ?? 0),
                      0
                    )}
                    symbol={currenciesById.EUR.symbol}
                  />
                </th>
              </tr>
            </tfoot>
          </AccountsTable>
        </>
      )}
    </Card>
  );
};
