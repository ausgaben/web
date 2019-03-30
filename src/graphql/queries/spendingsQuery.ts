import gql from 'graphql-tag';
import { DateTime } from 'luxon';

export const spendingsQuery = gql`
  query spendings(
    $accountId: ID!
    $startDate: String!
    $endDate: String!
    $startKey: ID
  ) {
    spendings(
      accountId: $accountId
      startDate: $startDate
      endDate: $endDate
      startKey: $startKey
    ) {
      items {
        _meta {
          id
        }
        bookedAt
        booked
        category
        description
        amount
        currency {
          id
          toEUR
        }
        paidWith
      }
      nextStartKey
    }
  }
`;

export const month = () => {
  const startDate = DateTime.local().startOf('month');
  const endDate = startDate.endOf('month');
  return {
    startDate,
    endDate
  };
};
