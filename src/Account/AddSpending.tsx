import React, { useState, useEffect } from 'react';
import { Connect } from 'aws-amplify-react';
import {
  ButtonGroup,
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
  Input,
  Row,
  Col
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import './Info.scss';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { GraphQLError } from 'graphql';
import { currencies, NOK } from '../currency/currencies';
import { Cache } from 'aws-amplify';
import './AddSpending.scss';
import { remove, splice } from '../util/splice';

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
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(
    Cache.getItem('addSpending.currency') || NOK.id
  );
  const [paymentMethods, setPaymentMethods] = useState(
    Cache.getItem('addSpending.paymentMethods') || []
  );

  const isValid =
    category.length && description.length && parseFloat(amount) > 0;

  let tabIndex = 0;

  return (
    <Form className="addSpending">
      <Card>
        <CardHeader>
          <CardTitle>
            Add {isIncome ? 'income' : 'spending'} to <em>{name}</em>
          </CardTitle>
        </CardHeader>
        {!added && (
          <Mutation mutation={addSpendingQuery}>
            {addSpendingMutation => (
              <>
                <CardBody>
                  <FormGroup className="oneLine">
                    <Label for="spentAt">Date</Label>
                    <Input
                      tabIndex={++tabIndex}
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
                  <FormGroup className="oneLine">
                    <Label for="category">Category</Label>
                    <Input
                      disabled={adding}
                      tabIndex={++tabIndex}
                      type="text"
                      name="category"
                      id="category"
                      placeholder="e.g. 'Mat'"
                      value={category}
                      required
                      onChange={({ target: { value } }) => setCategory(value)}
                    />
                  </FormGroup>
                  <FormGroup className="oneLine">
                    <Label for="description">Description</Label>
                    <Input
                      disabled={adding}
                      tabIndex={++tabIndex}
                      type="text"
                      name="description"
                      id="description"
                      placeholder="e.g. 'Rema 1000'"
                      value={description}
                      required
                      onChange={({ target: { value } }) =>
                        setDescription(value)
                      }
                    />
                  </FormGroup>
                  <div className="amount">
                    <FormGroup className="oneLine">
                      <Label for="amount">Amount</Label>
                      <Input
                        disabled={adding}
                        tabIndex={++tabIndex}
                        type="number"
                        min="0"
                        name="amount"
                        id="amount"
                        placeholder="e.g. '123.45'"
                        value={amount}
                        required
                        onChange={({ target: { value } }) =>
                          setAmount((Math.abs(+value) as unknown) as string)
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="currency" hidden>
                        Currency
                      </Label>
                      <Input
                        type="select"
                        name="currency"
                        id="currency"
                        value={currency}
                        disabled={adding}
                        onChange={({ target: { value } }) => {
                          setCurrency(value);
                          Cache.setItem('addSpending.currency', value);
                        }}
                      >
                        {currencies.map(({ id }) => (
                          <option key={id}>{id}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                  <FormGroup className="oneLine">
                    <Label>Type</Label>
                    <ButtonGroup>
                      <Button
                        color="danger"
                        outline={isIncome}
                        onClick={() => setIsIncome(false)}
                      >
                        Spending
                      </Button>
                      <Button
                        color="success"
                        outline={!isIncome}
                        onClick={() => setIsIncome(true)}
                      >
                        Income
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                  <FormGroup className="oneLine withValueSelector">
                    <Label for="paidWith">paid with</Label>
                    <div>
                      <Input
                        disabled={adding}
                        type="text"
                        name="paidWith"
                        id="paidWith"
                        placeholder="e.g. 'VISA Debit'"
                        value={paidWith}
                        onChange={({ target: { value } }) => {
                          setPaidWith(value);
                        }}
                        onBlur={({ target: { value } }) => {
                          if (!value.length) return;
                          const m = Array.from(
                            new Set([...paymentMethods, value]).values()
                          );
                          setPaymentMethods(m);
                          Cache.setItem('addSpending.paymentMethods', m);
                        }}
                      />
                      <ValueSelector
                        values={paymentMethods}
                        disabled={adding}
                        onSelect={setPaidWith}
                        onDelete={method => {
                          const m = remove(paymentMethods, method);
                          setPaymentMethods(m);
                          Cache.setItem('addSpending.paymentMethods', m);
                        }}
                      />
                    </div>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    disabled={adding || !isValid}
                    tabIndex={++tabIndex}
                    onClick={async () => {
                      setAdding(true);
                      setError(false);
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
                  {added && (
                    <Note>{isIncome ? 'Income' : 'Spending'} added.</Note>
                  )}
                  {error && (
                    <Fail>
                      Adding {isIncome ? 'Income' : 'Spending'} failed.
                    </Fail>
                  )}
                </CardFooter>
              </>
            )}
          </Mutation>
        )}
      </Card>
    </Form>
  );
};

const ValueSelector = ({
  values,
  onSelect,
  onDelete,
  disabled
}: {
  values: string[];
  onSelect: (value: string) => void;
  onDelete: (value: string) => void;
  disabled?: boolean;
}) => {
  if (!values.length) {
    return null;
  }
  return (
    <div className="valueSelector">
      {values.map(method => (
        <PredefinedValueButton
          value={method}
          onSelect={() => onSelect(method)}
          onDelete={() => onDelete(method)}
          key={method}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

const PredefinedValueButton = ({
  value,
  onSelect,
  onDelete,
  disabled
}: {
  value: string;
  onSelect: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0 as any);
  return (
    <ButtonGroup>
      <Button
        tabIndex={-1}
        color="info"
        size="sm"
        outline
        disabled={disabled}
        onClick={() => onSelect()}
      >
        {value}
      </Button>
      <Button
        tabIndex={-1}
        color={confirmDelete ? 'danger' : 'info'}
        size="sm"
        outline={!confirmDelete}
        disabled={disabled}
        onClick={() => {
          if (confirmDelete) {
            clearTimeout(timeoutId);
            onDelete();
          } else {
            setConfirmDelete(true);
            setTimeoutId(
              setTimeout(() => {
                setConfirmDelete(false);
              }, 1000)
            );
          }
        }}
      >
        {!confirmDelete ? '⨯' : '⁉️'}
      </Button>
    </ButtonGroup>
  );
};
