import React, { useState } from "react";
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
  CardFooter,
} from "reactstrap";
import gql from "graphql-tag";
import { Mutation } from "@apollo/client/react/components";
import { accountsQuery } from "../graphql/queries/accountsQuery";
import { Account } from "../schema";

export const createAccountQuery = gql`
  mutation createAccount($name: String!, $isSavingsAccount: Boolean!) {
    createAccount(name: $name, isSavingsAccount: $isSavingsAccount) {
      id
    }
  }
`;

export const CreateAccount = () => {
  const [name, setName] = useState("");
  const [isSavingsAccount, setIsSavingsAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setIsSavingsAccount(false);
    setSubmitting(false);
  };

  const isValid = name.length;
  return (
    <Mutation<
      {
        createAccount: { id: string };
      },
      {
        name: string;
        isSavingsAccount: boolean;
      }
    >
      mutation={createAccountQuery}
      update={(cache, { data }) => {
        const {
          createAccount: { id },
        } = data!;
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
                  ...accounts,
                  {
                    name,
                    isSavingsAccount,
                    _meta: {
                      id,
                      __typename: "EntityMeta",
                    },
                    __typename: "Account",
                  },
                ],
              },
            },
          });
        }
        reset();
      }}
    >
      {(createAccountMutation) => (
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
                  />{" "}
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
                      name: name.trim(),
                      isSavingsAccount,
                    },
                  });
                }}
              >
                {(() => {
                  if (submitting) return "Adding ...";
                  if (isSavingsAccount) return "Add savings account";
                  return "Add spendings account";
                })()}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Mutation>
  );
};
