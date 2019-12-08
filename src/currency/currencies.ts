import { Currency } from '../schema';

export const NOK = {
  id: 'NOK',
  symbol: 'kr'
};
export const EUR = {
  id: 'EUR',
  symbol: '€'
};
export const currencies = [EUR, NOK];
export const currenciesById: { [key: string]: Currency } = {
  NOK: NOK,
  EUR: EUR
};
