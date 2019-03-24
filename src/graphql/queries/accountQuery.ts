import gql from 'graphql-tag';

export const accountQuery = gql`
  query accounts($accountId: ID!) {
    accounts(filter: { accountId: $accountId }) {
      items {
        name
        isSavingsAccount
        _meta {
          id
        }
      }
    }
  }
`;
