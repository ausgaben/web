import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Form
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from '@apollo/react-components';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';
import { InviteUserToAccount } from './InviteUserToAccount';
import { EUR, NOK } from '../currency/currencies';

export const deleteAccountQuery = gql`
  mutation deleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId)
  }
`;

export const updateDefaultCurrencyQuery = gql`
  mutation updateAccount($accountId: ID!, $defaultCurrencyId: ID!) {
    updateAccount(accountId: $accountId, defaultCurrencyId: $defaultCurrencyId)
  }
`;

export const Settings = (props: { account: Account }) => {
  const {
    account: {
      name,
      defaultCurrency,
      _meta: { id }
    }
  } = props;
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string>();
  const [defaultCurrencyId, setDefaultCurrencyId] = useState(
    defaultCurrency.id
  );

  return (
    <Card>
      <>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <InviteUserToAccount account={props.account} />
            <Mutation<{}, { accountId: string; defaultCurrencyId: string }>
              mutation={updateDefaultCurrencyQuery}
            >
              {updateDefaultCurrencyQueryMutation => (
                <fieldset>
                  <legend>Settings</legend>
                  <FormGroup>
                    <Label for="defaultCurrency">Default Currency</Label>
                    <Input
                      type="select"
                      name="defaultCurrency"
                      id="defaultCurrency"
                      value={defaultCurrencyId}
                      onChange={e => {
                        const oldValue = defaultCurrencyId;
                        setDefaultCurrencyId(e.target.value);
                        updateDefaultCurrencyQueryMutation({
                          variables: {
                            accountId: id,
                            defaultCurrencyId: e.target.value
                          }
                        }).then(
                          ({ errors }: { errors?: GraphQLError[] } | any) => {
                            if (errors) {
                              setError(errors[0].message);
                              setDefaultCurrencyId(oldValue);
                            }
                          }
                        );
                      }}
                    >
                      <option value={EUR.id}>
                        {EUR.id} ({EUR.symbol})
                      </option>
                      <option value={NOK.id}>
                        {NOK.id} ({NOK.symbol})
                      </option>
                    </Input>
                  </FormGroup>
                </fieldset>
              )}
            </Mutation>
          </Form>
        </CardBody>
      </>
      {deleted && (
        <CardBody>
          <Note>Account deleted.</Note>
        </CardBody>
      )}
      {error && (
        <CardBody>
          <Fail>{error}</Fail>
        </CardBody>
      )}
      {!deleted && (
        <Mutation<{}, { accountId: string }>
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
                        setError(errors[0].message);
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
        </Mutation>
      )}
    </Card>
  );
};
