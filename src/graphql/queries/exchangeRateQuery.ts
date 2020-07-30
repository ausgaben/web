import gql from "graphql-tag";

export const exchangeRateQuery = gql`
  query exchangeRate($currencyId: ID!, $date: String!) {
    exchangeRate(currencyId: $currencyId, date: $date) {
      currency {
        id
        symbol
      }
      rate
      date
    }
  }
`;

export type ExchangeRateVariables = {
  currencyId: string;
  date: string;
};

export type ExchangeRate = {
  exchangeRate: {
    currency: {
      id: string;
      symbol: string;
    };
    rate: number;
    date: string;
  };
};
