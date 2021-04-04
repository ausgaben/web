import React from "react";
import {
  CreateSpendingForm,
  UpdateSpendingForm,
} from "../SpendingForm/SpendingForm";
import { WithAccount } from "../Accounts/WithAccount";
import { WithSpendings } from "../Spendings/WithSpendings";
import { Loading } from "../Loading/Loading";
import { RouteComponentProps } from "react-router-dom";
import { Main } from "../Styles";
import { WithSavingsAccounts } from "../Accounts/WithSavingsAccounts";

type routeProps = RouteComponentProps<{
  accountId: string;
  spendingId?: string;
}>;

export const AddSpendingPage = (props: routeProps) => (
  <Main>
    <WithAccount {...props}>
      {(account) => {
        const spendingId = new URLSearchParams(props.location.search).get(
          "copy"
        );
        if (spendingId) {
          return (
            <WithSavingsAccounts loading={<Loading />}>
              {(savingsAccounts) => (
                <WithSpendings account={account} loading={<Loading />}>
                  {({ spendings }) => (
                    <CreateSpendingForm
                      account={account}
                      spending={spendings.find(
                        ({ _meta: { id } }) => id === spendingId
                      )}
                      savingsAccounts={savingsAccounts}
                    />
                  )}
                </WithSpendings>
              )}
            </WithSavingsAccounts>
          );
        }
        return (
          <WithSavingsAccounts loading={<Loading />}>
            {(savingsAccounts) => (
              <CreateSpendingForm
                account={account}
                savingsAccounts={savingsAccounts}
              />
            )}
          </WithSavingsAccounts>
        );
      }}
    </WithAccount>
  </Main>
);

export const UpdatedSpendingPage = (props: routeProps) => (
  <Main>
    <WithAccount {...props}>
      {(account) => {
        const spendingId = props.match.params.spendingId!;
        return (
          <WithSavingsAccounts loading={<Loading />}>
            {(savingsAccounts) => (
              <WithSpendings account={account} loading={<Loading />}>
                {({ spendings }) => (
                  <UpdateSpendingForm
                    account={account}
                    spending={
                      spendings.find(({ _meta: { id } }) => id === spendingId)!
                    }
                    savingsAccounts={savingsAccounts}
                  />
                )}
              </WithSpendings>
            )}
          </WithSavingsAccounts>
        );
      }}
    </WithAccount>
  </Main>
);
