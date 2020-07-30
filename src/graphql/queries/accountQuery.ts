import gql from "graphql-tag";

export const accountQuery = gql`
  query accounts($accountId: ID!) {
    accounts(filter: { accountId: $accountId }) {
      items {
        name
        isSavingsAccount
        defaultCurrency {
          id
          symbol
        }
        _meta {
          id
          version
        }
      }
    }
  }
`;
