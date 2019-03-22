import gql from 'graphql-tag';

export const accountsQuery = gql`
  query accounts($startKey: ID) {
    accounts(startKey: $startKey) {
      items {
        _meta {
          uuid
        }
        name
        isSavingsAccount
      }
      nextStartKey
    }
  }
`;
