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
    $savingForAccountId: ID
  ) {
    createSpending(
      accountId: $accountId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
      savingForAccountId: $savingForAccountId
    ) {
      id
    }
  }
`;

export type createSpendingMutationVariables = {
  accountId: string;
  bookedAt: string;
  booked: boolean;
  category: string;
  description: string;
  amount: number;
  currencyId: string;
  savingForAccountId?: string;
};

export type createSpendingMutationResult = {
  createSpending: { id: string };
};
