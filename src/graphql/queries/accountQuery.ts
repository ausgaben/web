import gql from 'graphql-tag';

export const accountQuery = gql`
  query accounts($uuid: ID!) {
    accounts(filter: { uuid: $uuid }) {
      items {
        name
        isSavingsAccount
        _meta {
          uuid
        }
      }
    }
  }
`;
