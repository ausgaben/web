import * as React from "react";
import styled from "styled-components";
import { mobileBreakpoint } from "../../Styles";

const Money = styled.span`
  white-space: nowrap;
  text-align: right;
  display: inline-block;
`;

const Currency = styled.span`
  opacity: 0.5;
  font-size: 80%;
  @media (min-width: ${mobileBreakpoint}) {
    font-size: 100%;
  }
`;

const Income = styled(Money)`
  color: green;
`;
const Spending = styled(Money)`
  color: darkred;
`;
const Minus = styled(Currency)``;
const Amount = styled.span``;

const Approximation = styled(Currency)``;

export const FormatMoney = ({
  amount,
  symbol,
  approximation,
}: {
  amount: number;
  symbol: string;
  approximation?: boolean;
}) => {
  let formatted = `${Math.floor(Math.abs(Math.round(amount) / 100))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${`0${Math.abs(
    Math.round(amount) % 100
  )}`.slice(-2)}`.replace(/,00$/, "");
  let C = Money;
  if (amount > 0) C = Income;
  if (amount < 0) C = Spending;
  return (
    <C>
      {approximation && (
        <sup>
          <Approximation>~</Approximation>
        </sup>
      )}
      <Amount>
        {amount < 0 && <Minus>−</Minus>}
        {formatted}
      </Amount>
      <Currency>{symbol}</Currency>
    </C>
  );
};
