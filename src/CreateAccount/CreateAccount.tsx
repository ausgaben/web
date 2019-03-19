import React, { useState } from 'react';
import { Connect } from 'aws-amplify-react';
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

export const createAccountQuery = `
  mutation createAccount($name: String!, $isSavingsAccount: Boolean!) {
    createAccount(
        name: $name,
        isSavingsAccount: $isSavingsAccount
    )
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
    <Connect mutation={graphqlOperation(createAccountQuery)}>
      {({
        mutation: createAccountMutation
      }: {
        mutation: (args: object) => Promise<void>;
      }) => (
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
                  const res = await createAccountMutation({
                    name,
                    isSavingsAccount
                  });
                  reset();
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
    </Connect>
  );
};
