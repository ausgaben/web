import React, { useState } from 'react';
import { graphqlOperation } from 'aws-amplify';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  CardFooter
} from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';

export const createAccountQuery = gql`
  mutation createAccount($name: String!, $isSavingsAccount: Boolean!) {
    createAccount(name: $name, isSavingsAccount: $isSavingsAccount)
  }
`;

export const CreateAccount = () => {
  const [name, setName] = useState('');
  const [isSavingsAccount, setIsSavingsAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setIsSavingsAccount(false);
    setSubmitting(false);
  };

  const isValid = name.length;
  return (
    <Mutation
      mutation={createAccountQuery}
      refetchQueries={[{ query: accountsQuery }]}
      onCompleted={() => {
        reset();
      }}
    >
      {createAccountMutation => (
        <Form>
          <Card>
            <CardHeader>
              <CardTitle>Add a new account</CardTitle>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  disabled={submitting}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. 'Spendings'"
                  value={name}
                  required
                  onChange={({ target: { value: name } }) => setName(name)}
                />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    disabled={submitting}
                    type="checkbox"
                    checked={isSavingsAccount}
                    onChange={() => setIsSavingsAccount(!isSavingsAccount)}
                  />{' '}
                  This is a savings account
                </Label>
              </FormGroup>
            </CardBody>
            <CardFooter>
              <Button
                disabled={!isValid || submitting}
                onClick={async () => {
                  setSubmitting(true);
                  await createAccountMutation({
                    variables: {
                      name,
                      isSavingsAccount
                    }
                  });
                }}
              >
                {(() => {
                  if (submitting) return 'Adding ...';
                  if (isSavingsAccount) return 'Add savings account';
                  return 'Add spendings account';
                })()}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Mutation>
  );
};
