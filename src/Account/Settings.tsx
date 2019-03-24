import React, { useState } from 'react';
import { Connect } from 'aws-amplify-react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Form
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';

export const deleteAccountQuery = gql`
  mutation deleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId)
  }
`;

export const Settings = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id }
    }
  } = props;
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Form>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        {deleted && (
          <CardBody>
            <Note>Account deleted.</Note>
          </CardBody>
        )}
        {error && (
          <CardBody>
            <Fail>Account deletion failed.</Fail>
          </CardBody>
        )}
        {!deleted && (
          <Mutation
            mutation={deleteAccountQuery}
            update={cache => {
              const res = cache.readQuery<{
                accounts: {
                  items: Account[];
                };
              }>({ query: accountsQuery });
              if (res) {
                const {
                  accounts: { items: accounts }
                } = res;
                const accountToDelete = accounts.find(
                  ({ _meta: { id: u } }) => id === u
                );
                if (accountToDelete) {
                  accounts.splice(accounts.indexOf(accountToDelete), 1);
                  cache.writeQuery({
                    query: accountsQuery,
                    data: {
                      ...res,
                      accounts: {
                        ...res.accounts,
                        items: accounts
                      }
                    }
                  });
                }
              }
            }}
          >
            {deleteAccountMutation => (
              <CardFooter>
                <nav>
                  <Link to={`/account/${id}`}>cancel</Link>
                  <Button
                    disabled={deleting}
                    onClick={async () => {
                      setDeleting(true);
                      deleteAccountMutation({
                        variables: { accountId: id }
                      }).then(
                        async ({
                          errors
                        }: { errors?: GraphQLError[] } | any) => {
                          if (errors) {
                            setError(true);
                            setDeleting(false);
                          } else {
                            setDeleted(true);
                          }
                        }
                      );
                    }}
                    color="danger"
                  >
                    Delete
                  </Button>
                </nav>
              </CardFooter>
            )}
          </Mutation>
        )}
      </Card>
    </Form>
  );
};
