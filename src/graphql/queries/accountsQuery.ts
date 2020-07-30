import gql from "graphql-tag";
import { Account } from "../../schema";

export const accountsQuery = gql`
  query accounts($startKey: ID) {
    accounts(startKey: $startKey) {
      items {
        _meta {
          id
          version
          name
          createdAt
        }
        name
        isSavingsAccount
        defaultCurrency {
          id
          symbol
        }
      }
      nextStartKey
    }
  }
`;

export type AccountItem = {
  _meta: {
    id: string;
    version: number;
    name: string;
    createdAt: string;
  };
  name: string;
  isSavingsAccount: boolean;
  defaultCurrency: {
    id: string;
    symbol: string;
  };
};

export type Accounts = {
  accounts: {
    items: AccountItem[];
    nextStartKey?: any;
  };
};

export const toAccount = (accountItem: AccountItem): Account => ({
  ...accountItem,
  _meta: {
    ...accountItem._meta,
    createdAt: new Date(accountItem._meta.createdAt),
  },
});
