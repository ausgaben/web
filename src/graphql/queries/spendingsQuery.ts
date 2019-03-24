import gql from 'graphql-tag';

export const spendingsQuery = gql`
  query spendings($accountId: ID!, $startKey: ID) {
    spendings(accountId: $accountId, startKey: $startKey) {
      items {
        _meta {
          id
        }
        bookedAt
        category
        description
        amount
        currency {
          id
          toEUR
        }
        isIncome
        isPending
        paidWith
      }
      nextStartKey
    }
  }
`;
