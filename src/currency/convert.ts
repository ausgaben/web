import { Currency } from '../schema';
import { NOK, EUR } from './currencies';

const exchangeRates = {
  [NOK.id]: [
    {
      date: new Date('2019-12-08T22:01:03.851Z'),
      rate: 1 / 0.099
    },
    {
      date: new Date('2017-01-01T00:00:00.0Z'),
      rate: 1 / 0.103449
    }
  ]
};

export const convertToEUR = (
  amount: number,
  from: Currency,
  when: Date
): number => {
  if (from.id === EUR.id) return amount;
  const rate = exchangeRates[from.id].find(
    ({ date }) => date.getTime() < when.getTime()
  )?.rate;
  if (!rate) {
    console.error(`No exchange rate found for ${from.id}!`);
    return amount;
  }
  return rate * amount;
};
