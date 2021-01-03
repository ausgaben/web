import gql from "graphql-tag";

export const updatedSpendingMutation = gql`
  mutation updateSpending(
    $spendingId: ID!
    $bookedAt: String!
    $booked: Boolean
    $category: String!
    $description: String!
    $amount: Int!
    $currencyId: ID!
  ) {
    updateSpending(
      spendingId: $spendingId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
    )
  }
`;
