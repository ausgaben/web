import React, { useState } from 'react';
import { Spending } from '../schema';
import { Loading } from '../Loading/Loading';
import { Fail, Note } from '../Note/Note';
import { Mutation, Query } from 'react-apollo';
import {
  allTime,
  month,
  spendingsQuery
} from '../graphql/queries/spendingsQuery';
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle
} from 'reactstrap';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { currenciesById } from '../currency/currencies';
import { FormatMoney } from '../util/date/FormatMoney';
import { FormatDate } from '../util/date/FormatDate';
import { WithAccount } from '../Accounts/WithAccount';

export const deleteSpendingQuery = gql`
  mutation deleteSpending($spendingId: ID!) {
    deleteSpending(spendingId: $spendingId)
  }
`;

export const Page = (props: {
  match: { params: { spendingId: string; accountId: string } };
}) => {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(false);
  const {
    match: {
      params: { accountId, spendingId }
    }
  } = props;

  return (
    <WithAccount {...props}>
      {account => {
        const { startDate, endDate } = account.isSavingsAccount
          ? allTime()
          : month();
        return (
          <Query
            query={spendingsQuery}
            variables={{
              accountId,
              startDate: startDate.toISO(),
              endDate: endDate.toISO()
            }}
          >
            {({ data, loading, error }: any) => {
              if (error) {
                return (
                  <>
                    <h3>Error</h3>
                    {JSON.stringify(error)}
                  </>
                );
              }
              if (deleted) {
                return (
                  <>
                    <CardHeader>
                      <CardTitle>Spending</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Note>Spending deleted.</Note>
                    </CardBody>
                    <CardFooter>
                      <nav>
                        <Link to={`/account/${accountId}`}>back</Link>
                      </nav>
                    </CardFooter>
                  </>
                );
              }

              if (loading || !data)
                return <Loading text={'Loading spending ...'} />;
              const spending = (data.spendings.items as Spending[]).find(
                ({ _meta: { id } }) => id === spendingId
              );
              if (spending) {
                return (
                  <>
                    {error && (
                      <CardBody>
                        <Fail>Spending deletion failed.</Fail>
                      </CardBody>
                    )}
                    {!deleted && (
                      <>
                        <CardHeader>
                          <CardTitle>Spending</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <dl>
                            <dt>Date</dt>
                            <dd>
                              <FormatDate date={spending.bookedAt} />
                            </dd>
                            <dt>Category</dt>
                            <dd>{spending.category}</dd>
                            <dt>Description</dt>
                            <dd>{spending.description}</dd>
                            <dt>Amount</dt>
                            <dd>
                              <FormatMoney
                                amount={spending.amount}
                                symbol={
                                  currenciesById[spending.currency.id].symbol
                                }
                              />
                            </dd>
                            <dt>Paid with</dt>
                            <dd>{spending.paidWith}</dd>
                            <dt>Booked?</dt>
                            <dd>{spending.booked ? 'Yes' : 'No'}</dd>
                          </dl>
                        </CardBody>
                        <Mutation
                          mutation={deleteSpendingQuery}
                          update={cache => {
                            const res = cache.readQuery<{
                              spendings: {
                                items: Spending[];
                              };
                            }>({
                              query: spendingsQuery,
                              variables: { accountId }
                            });
                            if (res) {
                              const {
                                spendings: { items: spendings }
                              } = res;
                              const spendingToDelete = spendings.find(
                                ({ _meta: { id: u } }) => spendingId === u
                              );
                              if (spendingToDelete) {
                                spendings.splice(
                                  spendings.indexOf(spendingToDelete),
                                  1
                                );
                                cache.writeQuery({
                                  query: spendingsQuery,
                                  data: {
                                    ...res,
                                    spendings: {
                                      ...res.spendings,
                                      items: spendings
                                    }
                                  }
                                });
                              }
                              setDeleted(true);
                            }
                          }}
                        >
                          {deleteSpendingMutation => (
                            <CardFooter>
                              <Link to={`/account/${accountId}`}>cancel</Link>
                              <Button
                                disabled={deleting}
                                onClick={async () => {
                                  setDeleting(true);
                                  deleteSpendingMutation({
                                    variables: { spendingId }
                                  }).then(
                                    async ({
                                      errors
                                    }: { errors?: GraphQLError[] } | any) => {
                                      if (errors) {
                                        setError(true);
                                        setDeleting(false);
                                      }
                                    }
                                  );
                                }}
                                color="danger"
                              >
                                Delete
                              </Button>
                            </CardFooter>
                          )}
                        </Mutation>
                      </>
                    )}
                  </>
                );
              }
              return <Note>Spending {spendingId} not found.</Note>;
            }}
          </Query>
        );
      }}
    </WithAccount>
  );
};
