import { Currency } from '../schema';

export const NOK = {
  id: 'NOK',
  toEUR: 0.103449,
  symbol: 'kr'
};
export const EUR = {
  id: 'EUR',
  toEUR: 1,
  symbol: '€'
};
export const currencies = [EUR, NOK];
export const currenciesById: { [key: string]: Currency } = {
  NOK: NOK,
  EUR: EUR
};
