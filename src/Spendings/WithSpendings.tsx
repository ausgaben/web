import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Account, Spending } from '../schema';
import {
  allTime,
  month,
  spendingsQuery
} from '../graphql/queries/spendingsQuery';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Query } from 'react-apollo';
import { ListingHeader } from '../ListingHeader/ListingHeader';

export const WithSpendings = (props: {
  account: Account;
  loading: React.ReactNode;
  children: (args: {
    spendings: Spending[];
    refetch: () => void;
    next?: () => void;
    variables: any;
  }) => React.ReactElement;
}) => {
  const {
    account: {
      isSavingsAccount,
      _meta: { id: accountId }
    },
    children
  } = props;

  const { startDate, endDate } = isSavingsAccount ? allTime() : month();
  const variables = {
    accountId,
    startDate: startDate.toISO(),
    endDate: endDate.toISO()
  };

  return (
    <Query query={spendingsQuery} variables={variables}>
      {({ data, loading, error, refetch }: any) => {
        if (error) {
          return (
            <>
              <h3>Error</h3>
              {JSON.stringify(error)}
            </>
          );
        }
        if (loading || !data) return props.loading;
        return children({
          spendings: data.spendings.items,
          refetch: () => refetch(variables),
          variables,
          next: data.spendings.nextStartKey
            ? () =>
                refetch({
                  ...variables,
                  startKey: data.spendings.nextStartKey
                })
            : undefined
        });
      }}
    </Query>
  );
};
