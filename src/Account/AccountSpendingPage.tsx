import React from "react";
import {
  CreateSpendingForm,
  UpdateSpendingForm,
} from "../SpendingForm/SpendingForm";
import { WithAccount } from "../Accounts/WithAccounts";
import { WithSpendings } from "../Spendings/WithSpendings";
import { Loading } from "../Loading/Loading";
import { RouteComponentProps } from "react-router-dom";
import { Main } from "../Styles";

type routeProps = RouteComponentProps<{
  accountId: string;
  spendingId?: string;
}>;

export const AddSpendingPage = (props: routeProps) => (
  <Main>
    <WithAccount accountId={props.match.params.accountId}>
      {(account, otherAccounts) => {
        const spendingId = new URLSearchParams(props.location.search).get(
          "copy"
        );
        if (spendingId) {
          return (
            <WithSpendings account={account} loading={<Loading />}>
              {({ spendings }) => (
                <CreateSpendingForm
                  account={account}
                  spending={spendings.find(
                    ({ _meta: { id } }) => id === spendingId
                  )}
                  otherAccounts={otherAccounts}
                />
              )}
            </WithSpendings>
          );
        }
        return (
          <CreateSpendingForm account={account} otherAccounts={otherAccounts} />
        );
      }}
    </WithAccount>
  </Main>
);

export const UpdatedSpendingPage = (props: routeProps) => (
  <Main>
    <WithAccount accountId={props.match.params.accountId}>
      {(account, otherAccounts) => {
        const spendingId = props.match.params.spendingId!;
        return (
          <WithSpendings account={account} loading={<Loading />}>
            {({ spendings }) => (
              <UpdateSpendingForm
                account={account}
                spending={
                  spendings.find(({ _meta: { id } }) => id === spendingId)!
                }
                otherAccounts={otherAccounts}
              />
            )}
          </WithSpendings>
        );
      }}
    </WithAccount>
  </Main>
);
