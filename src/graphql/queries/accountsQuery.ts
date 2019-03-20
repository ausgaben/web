import gql from 'graphql-tag';

export const accountsQuery = gql`
  query accounts {
    accounts {
      items {
        _meta {
          uuid
        }
        name
        isSavingsAccount
      }
    }
  }
`;
