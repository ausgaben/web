import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';
import { InviteUserToAccount } from './InviteUserToAccount';

export const deleteAccountQuery = gql`
  mutation deleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId)
  }
`;

class DeleteAccountMutation extends Mutation<{}, { accountId: string }> {}

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
    <Card>
      <>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardBody>
          <InviteUserToAccount account={props.account} />
        </CardBody>
      </>
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
        <DeleteAccountMutation
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
              <Link to={`/account/${id}`}>⬅</Link>
              <Button
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  deleteAccountMutation({
                    variables: { accountId: id }
                  }).then(
                    async ({ errors }: { errors?: GraphQLError[] } | any) => {
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
            </CardFooter>
          )}
        </DeleteAccountMutation>
      )}
    </Card>
  );
};
