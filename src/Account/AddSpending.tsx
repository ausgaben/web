import React, { useState } from 'react';
import { Connect } from 'aws-amplify-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import './Info.scss';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';

export const addSpendingQuery = gql`
  mutation addSpending($accountId: ID!) {
    addSpending(accountId: $accountId)
  }
`;

export const AddSpending = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { uuid }
    }
  } = props;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [spentAt, setSpentAt] = useState(new Date());
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paidWith, setPaidWith] = useState('');
  const [amount, setAmount] = useState(0);

  return (
    <Form>
      <Card>
        <CardHeader>
          <CardTitle>
            Add {isIncome ? 'income' : 'spending'} to <em>{name}</em>
          </CardTitle>
        </CardHeader>
        {added && (
          <CardBody>
            <Note>{isIncome ? 'Income' : 'Spending'} added.</Note>
          </CardBody>
        )}
        {error && (
          <CardBody>
            <Fail>{isIncome ? 'Income' : 'Spending'} failed.</Fail>
          </CardBody>
        )}
        {!added && (
          <Mutation mutation={addSpendingQuery}>
            {addSpendingMutation => (
              <>
                <CardBody>
                  <FormGroup>
                    <Label for="name">Category</Label>
                    <Input
                      disabled={adding}
                      type="text"
                      name="category"
                      id="category"
                      placeholder="e.g. 'Food'"
                      value={category}
                      required
                      onChange={({ target: { value } }) => setCategory(value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Description</Label>
                    <Input
                      disabled={adding}
                      type="text"
                      name="description"
                      id="description"
                      placeholder="e.g. 'Food'"
                      value={description}
                      required
                      onChange={({ target: { value } }) =>
                        setDescription(value)
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Amount</Label>
                    <Input
                      disabled={adding}
                      type="number"
                      min="0"
                      step="0.01"
                      name="amount"
                      id="amount"
                      placeholder="e.g. '123.45'"
                      value={amount}
                      required
                      onChange={({ target: { value } }) => setAmount(+value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">PaidWith</Label>
                    <Input
                      disabled={adding}
                      type="text"
                      name="paidWith"
                      id="paidWith"
                      placeholder="e.g. 'Credit Card'"
                      value={paidWith}
                      required
                      onChange={({ target: { value } }) => setPaidWith(value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Date</Label>
                    <Input
                      disabled={adding}
                      type="date"
                      name="spentAt"
                      id="spentAt"
                      value={spentAt.toISOString().substr(0, 10)}
                      required
                      onChange={({ target: { value } }) =>
                        setSpentAt(new Date(Date.parse(value)))
                      }
                    />
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    disabled={adding}
                    onClick={async () => {
                      setAdding(true);
                      addSpendingMutation({ variables: { uuid } }).then(
                        async ({
                          errors
                        }: { errors?: GraphQLError[] } | any) => {
                          if (errors) {
                            setError(true);
                            setAdding(false);
                          } else {
                            setAdded(true);
                          }
                        }
                      );
                    }}
                    color="primary"
                  >
                    Add
                  </Button>
                </CardFooter>
              </>
            )}
          </Mutation>
        )}
      </Card>
    </Form>
  );
};
