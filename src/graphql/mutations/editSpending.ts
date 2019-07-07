import gql from 'graphql-tag';

export const editSpendingMutation = gql`
  mutation editSpending(
    $spendingId: ID!
    $bookedAt: String!
    $booked: Boolean
    $category: String!
    $description: String!
    $amount: Int!
    $currencyId: ID!
    $paidWith: String
  ) {
    editSpending(
      spendingId: $spendingId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
      paidWith: $paidWith
    ) {
      version
    }
  }
`;
