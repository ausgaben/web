import React from 'react';
import { Link } from 'react-router-dom';
import { Account } from '../schema';
import { currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { WithSpendings } from '../Spendings/WithSpendings';

export const AccountItem = (props: { account: Account }) => {
  const {
    account: {
      name,
      isSavingsAccount,
      _meta: { id: accountId }
    }
  } = props;

  return (
    <WithSpendings
      {...props}
      loading={
        <tr>
          <td colSpan={3} />
        </tr>
      }
    >
      {({ spendings }) => {
        const hasNOK = spendings.find(({ currency: { id } }) => id === 'NOK');
        const sums = spendings.reduce(
          (sums, spending) => ({
            EUR: sums.EUR + spending.amount * spending.currency.toEUR,
            NOK:
              sums.NOK + (spending.currency.id === 'NOK' ? spending.amount : 0)
          }),
          { EUR: 0, NOK: 0 }
        );
        if (isSavingsAccount) {
          return (
            <tr>
              <td colSpan={!hasNOK ? 2 : 1}>
                <Link to={`/account/${accountId}`}>{name}</Link>
              </td>
              {hasNOK && (
                <td className="amount">
                  <FormatMoney
                    amount={sums.NOK}
                    symbol={currenciesById.NOK.symbol}
                  />
                </td>
              )}
              <td className="amount">
                <FormatMoney
                  amount={sums.EUR}
                  symbol={currenciesById.EUR.symbol}
                />
              </td>
            </tr>
          );
        }
        return (
          <tr>
            <td colSpan={2}>
              <Link to={`/account/${accountId}`}>{name}</Link>
            </td>
            <td style={{ textAlign: 'right' }}>—</td>
          </tr>
        );
      }}
    </WithSpendings>
  );
};
