import React, { useState } from 'react';
import { Spending } from '../schema';
import { Fail, Note } from '../Note/Note';
import { Mutation } from 'react-apollo';
import { spendingsQuery } from '../graphql/queries/spendingsQuery';
import {
  Button,
  Card,
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
import { WithSpendings } from '../Spendings/WithSpendings';
import { Loading } from '../Loading/Loading';

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
      {account => (
        <WithSpendings account={account} loading={<Loading />}>
          {({ spendings, variables }) => {
            if (deleted) {
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Spending</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Note>Spending deleted.</Note>
                  </CardBody>
                  <CardFooter>
                    <nav>
                      <Link to={`/account/${accountId}`}>⬅</Link>
                    </nav>
                  </CardFooter>
                </Card>
              );
            }

            const spending = spendings.find(
              ({ _meta: { id } }) => id === spendingId
            );
            if (spending) {
              return (
                <Card>
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
                            variables
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
                            <Link to={`/account/${accountId}`}>⬅</Link>
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
                </Card>
              );
            }
            return <Note>Spending {spendingId} not found.</Note>;
          }}
        </WithSpendings>
      )}
    </WithAccount>
  );
};
