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
  Form,
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

export const updateAccountQuery = gql`
  mutation updateAccount(
    $accountId: ID!
    $name: String!
    $defaultCurrencyId: ID
    $expectedVersion: Int!
  ) {
    updateAccount(
      accountId: $accountId
      expectedVersion: $expectedVersion
      name: $name
      defaultCurrencyId: $defaultCurrencyId
    )
  }
`;

export const Settings = (props: { account: Account }) => {
  const {
    account: {
      name,
      defaultCurrency,
      _meta: { id, version },
    },
  } = props;
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState<string>();
  const [defaultCurrencyId, setDefaultCurrencyId] = useState(
    defaultCurrency.id
  );
  const [updatedName, setName] = useState(name);
  const [displayName, setDisplayName] = useState(name);

  return (
    <Card>
      <>
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
        </CardHeader>
        <CardBody>
          <>
            <dl>
              <dt>Version</dt>
              <dd>{version}</dd>
            </dl>
            <Form>
              <InviteUserToAccount account={props.account} />
              <Mutation<
                {},
                {
                  accountId: string;
                  expectedVersion: number;
                  name: string;
                  defaultCurrencyId?: string;
                }
              >
                mutation={updateAccountQuery}
                update={(cache) => {
                  const res = cache.readQuery<{
                    accounts: {
                      items: Account[];
                    };
                  }>({ query: accountsQuery });
                  if (res) {
                    const {
                      accounts: { items: accounts },
                    } = res;
                    cache.writeQuery({
                      query: accountsQuery,
                      data: {
                        ...res,
                        accounts: {
                          ...res.accounts,
                          items: [
                            ...accounts.filter(
                              ({ _meta: { id: aid } }) => aid !== id
                            ),
                            {
                              ...accounts.find(
                                ({ _meta: { id: aid } }) => aid === id
                              ),
                              name: updatedName,
                            },
                          ],
                        },
                      },
                    });
                  }
                }}
              >
                {(updateAccountMutation) => (
                  <fieldset>
                    <legend>Settings</legend>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={updatedName}
                        onBlur={(e) => {
                          const oldValue = updatedName;
                          updateAccountMutation({
                            variables: {
                              accountId: id,
                              expectedVersion: version,
                              name: e.target.value,
                            },
                          }).then(
                            ({ errors }: { errors?: GraphQLError[] } | any) => {
                              if (errors) {
                                setError(errors[0].message);
                                setName(oldValue);
                              } else {
                                setDisplayName(updatedName);
                              }
                            }
                          );
                        }}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="defaultCurrency">Default Currency</Label>
                      <Input
                        type="select"
                        name="defaultCurrency"
                        id="defaultCurrency"
                        value={defaultCurrencyId}
                        onChange={(e) => {
                          const oldValue = defaultCurrencyId;
                          setDefaultCurrencyId(e.target.value);
                          updateAccountMutation({
                            variables: {
                              accountId: id,
                              name: updatedName,
                              defaultCurrencyId: e.target.value,
                              expectedVersion: version,
                            },
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
          </>
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
          update={(cache) => {
            const res = cache.readQuery<{
              accounts: {
                items: Account[];
              };
            }>({ query: accountsQuery });
            if (res) {
              const {
                accounts: { items: accounts },
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
                      items: accounts,
                    },
                  },
                });
              }
            }
          }}
        >
          {(deleteAccountMutation) => (
            <CardFooter>
              <Link to={`/account/${id}`}>⬅</Link>
              <Button
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  deleteAccountMutation({
                    variables: { accountId: id },
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
