import React from "react";
import { Account } from "../schema";
import { Loading } from "../Loading/Loading";
import { Query } from "@apollo/client/react/components";
import { accountsQuery } from "../graphql/queries/accountsQuery";
import { Note } from "../Note/Note";

export const WithAccounts = ({
  children,
}: {
  children: (accounts: Account[]) => React.ReactElement;
}) => {
  return (
    <Query query={accountsQuery} fetchPolicy={"cache-first"}>
      {({ data, loading, error }: any) => {
        if (error) {
          return (
            <>
              <h3>Error</h3>
              {JSON.stringify(error)}
            </>
          );
        }
        if (loading || !data) return <Loading text={"Loading accounts ..."} />;
        return children(data.accounts.items);
      }}
    </Query>
  );
};

export const WithAccount = ({
  children,
  accountId,
}: {
  children: (account: Account, otherAccounts: Account[]) => React.ReactElement;
  accountId: string;
}) => (
  <WithAccounts>
    {(accounts) => {
      const account = accounts.find(({ _meta: { id } }) => id === accountId);
      if (!account) {
        return <Note>Account {accountId} not found.</Note>;
      }
      return children(
        account,
        accounts.filter(({ _meta: { id } }) => id !== accountId)
      );
    }}
  </WithAccounts>
);
