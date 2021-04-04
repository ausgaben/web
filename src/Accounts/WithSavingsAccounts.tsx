import React from "react";
import { Account } from "../schema";
import { Query } from "@apollo/client/react/components";
import { accountsQuery } from "../graphql/queries/accountsQuery";

export const WithSavingsAccounts = (props: {
  children: (accounts: Account[]) => React.ReactElement;
  loading: React.ReactElement;
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
        if (loading || !data) return props.loading;
        return props.children(
          (data.accounts.items as Account[]).filter(
            ({ isSavingsAccount }) => isSavingsAccount === true
          )
        );
      }}
    </Query>
  );
};
