import { Currency } from "../schema";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  exchangeRateQuery,
  ExchangeRate,
} from "../graphql/queries/exchangeRateQuery";

const exchangeconversionRates: { [key: string]: Promise<number> } = {};
export const fetchExchangeRate = (
  client: ApolloClient<NormalizedCacheObject>
) => async (currency: Currency, date: Date): Promise<number> => {
  const k = `${currency.id}-${date.toISOString().substring(0, 10)}`;
  if (!exchangeconversionRates[k]) {
    exchangeconversionRates[k] = client
      .query<ExchangeRate>({
        query: exchangeRateQuery,
        fetchPolicy: "cache-first",
        variables: { currencyId: currency.id, date: date.toISOString() },
      })
      .then((res) => res.data.exchangeRate.rate);
  }
  return exchangeconversionRates[k];
};
