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
    $transferToAccountId: ID
  ) {
    updateSpending(
      spendingId: $spendingId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
      transferToAccountId: $transferToAccountId
    )
  }
`;

export type updatedSpendingMutationVariables = {
  spendingId: string;
  bookedAt: string;
  booked: boolean;
  category: string;
  description: string;
  amount: number;
  currencyId: string;
  transferToAccountId?: string;
};

export type updatedSpendingMutationResult = {
  updateSpending: { id: string };
};
