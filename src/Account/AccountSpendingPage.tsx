import React from 'react';
import {
  CreateSpendingForm,
  EditSpendingForm
} from '../SpendingForm/SpendingForm';
import { WithAccount } from '../Accounts/WithAccount';
import { WithSpendings } from '../Spendings/WithSpendings';
import { Loading } from '../Loading/Loading';
import { RouteComponentProps } from 'react-router-dom';
import { Account, Spending } from '../schema';

type routeProps = RouteComponentProps<{
  accountId: string;
  spendingId?: string;
}>;

export const AddSpendingPage = (props: routeProps) => (
  <main>
    <WithAccount {...props}>
      {account => {
        const spendingId = new URLSearchParams(props.location.search).get(
          'copy'
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
                />
              )}
            </WithSpendings>
          );
        }
        return <CreateSpendingForm account={account} />;
      }}
    </WithAccount>
  </main>
);

export const EditSpendingPage = (props: routeProps) => (
  <main>
    <WithAccount {...props}>
      {account => {
        const spendingId = props.match.params.spendingId!;
        return (
          <WithSpendings account={account} loading={<Loading />}>
            {({ spendings }) => (
              <EditSpendingForm
                account={account}
                spending={
                  spendings.find(({ _meta: { id } }) => id === spendingId)!
                }
              />
            )}
          </WithSpendings>
        );
      }}
    </WithAccount>
  </main>
);
