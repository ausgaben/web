import gql from "graphql-tag";

export const createSpendingMutation = gql`
  mutation createSpending(
    $accountId: ID!
    $bookedAt: String!
    $booked: Boolean
    $category: String!
    $description: String!
    $amount: Int!
    $currencyId: ID!
  ) {
    createSpending(
      accountId: $accountId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
    ) {
      id
    }
  }
`;
