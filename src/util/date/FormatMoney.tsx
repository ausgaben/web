import * as React from 'react';
import './FormatMoney.scss';
import classNames from 'classnames';

export const FormatMoney = ({
  amount,
  symbol
}: {
  amount: number;
  symbol: string;
}) => {
  let formatted = `${Math.floor(
    Math.abs(Math.round(amount) / 100)
  )}.${`0${Math.abs(Math.round(amount) % 100)}`.slice(-2)}`.replace(/.00$/, '');
  return (
    <span
      className={classNames('money', {
        income: amount > 0,
        spending: amount < 0
      })}
    >
      <span className="amount">
        {amount < 0 && <span className="minus">−</span>}
        {formatted}
      </span>
      <span className="currency">{symbol}</span>
    </span>
  );
};
