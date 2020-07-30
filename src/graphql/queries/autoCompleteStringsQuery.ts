import gql from "graphql-tag";

export const autoCompleteStringsQuery = gql`
  query autoCompleteStrings($accountId: ID!) {
    autoCompleteStrings(accountId: $accountId) {
      field
      strings
    }
  }
`;
