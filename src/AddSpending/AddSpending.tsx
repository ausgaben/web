import React, { useState } from 'react';
import { Connect } from 'aws-amplify-react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { GraphQLError } from 'graphql';
import { currencies, NOK } from '../currency/currencies';
import { Cache } from 'aws-amplify';
import { remove } from '../util/splice';
import { ValueSelector } from '../ValueSelector/ValueSelector';
import { Link } from 'react-router-dom';

export const createSpendingQuery = gql`
  mutation createSpending(
    $accountId: ID!
    $bookedAt: String!
    $category: String!
    $description: String!
    $amount: Int!
    $currencyId: ID!
    $isIncome: Boolean
    $isPending: Boolean
    $paidWith: String!
  ) {
    createSpending(
      accountId: $accountId
      bookedAt: $bookedAt
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
      isIncome: $isIncome
      isPending: $isPending
      paidWith: $paidWith
    ) {
      id
    }
  }
`;

export const AddSpending = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id }
    }
  } = props;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [bookedAt, setBookedAt] = useState(new Date());
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paidWith, setPaidWith] = useState('');
  const [amountWhole, setAmountWhole] = useState('');
  const [amountFraction, setAmountFraction] = useState('');
  const [currency, setCurrency] = useState(
    Cache.getItem('addSpending.currency') || NOK.id
  );
  const [paymentMethods, setPaymentMethods] = useState(
    Cache.getItem('addSpending.paymentMethods') || []
  );
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const amount =
    (amountWhole ? parseInt(amountWhole, 10) * 100 : 0) +
    (amountFraction ? parseInt(amountFraction, 10) : 0);

  const isValid = category.length && description.length && amount > 0;

  const reset = () => {
    setIsIncome(false);
    setIsPending(false);
    setDescription('');
    setAmountWhole('');
    setAmountFraction('');
  };

  let tabIndex = 0;

  return (
    <Form className="addSpending">
      <Card>
        <CardHeader>
          <CardTitle>
            Add {isIncome ? 'income' : 'spending'} to <em>{name}</em>
          </CardTitle>
        </CardHeader>
        <Mutation mutation={createSpendingQuery}>
          {createSpendingMutation => (
            <>
              <CardBody>
                <FormGroup className="oneLine">
                  <Label for="bookedAt">Date</Label>
                  <InputGroup>
                    <Input
                      tabIndex={++tabIndex}
                      disabled={adding}
                      type="date"
                      name="bookedAt"
                      id="bookedAt"
                      value={bookedAt.toISOString().substr(0, 10)}
                      required
                      onChange={({ target: { value } }) =>
                        setBookedAt(new Date(Date.parse(value)))
                      }
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        color="warning"
                        outline={!isPending}
                        onClick={() => setIsPending(true)}
                        title="Pending"
                      >
                        ⏳
                      </Button>
                    </InputGroupAddon>
                    <InputGroupAddon addonType="append">
                      <Button
                        color="success"
                        outline={isPending}
                        onClick={() => setIsPending(false)}
                        title="Booked"
                      >
                        ✓
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
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
                    onChange={({ target: { value } }) => setDescription(value)}
                  />
                </FormGroup>
                <div className="amount">
                  <FormGroup className="oneLine">
                    <Label for="amountWhole">Amount</Label>
                    <InputGroup>
                      <InputGroupButtonDropdown
                        addonType="prepend"
                        isOpen={currencyDropdownOpen}
                        toggle={() =>
                          setCurrencyDropdownOpen(!currencyDropdownOpen)
                        }
                      >
                        <DropdownToggle caret>{currency}</DropdownToggle>
                        <DropdownMenu>
                          {currencies.map(({ id }) => (
                            <DropdownItem
                              key={id}
                              onClick={() => {
                                setCurrency(id);
                                Cache.setItem('addSpending.currency', id);
                              }}
                            >
                              {id}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </InputGroupButtonDropdown>
                      <Input
                        disabled={adding}
                        tabIndex={++tabIndex}
                        type="number"
                        min="0"
                        name="amountWhole"
                        id="amountWhole"
                        placeholder="'123'"
                        value={amountWhole}
                        required
                        onChange={({ target: { value } }) => {
                          const v = Math.abs(+value);
                          if (v === 0) {
                            setAmountWhole('');
                          } else {
                            setAmountWhole((v as unknown) as string);
                          }
                        }}
                      />
                      <InputGroupAddon
                        addonType="append"
                        style={{ marginRight: -1 }}
                      >
                        <InputGroupText>.</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        disabled={adding}
                        tabIndex={++tabIndex}
                        type="number"
                        min="0"
                        max="99"
                        name="amountFraction"
                        id="amountFraction"
                        placeholder="'99'"
                        maxLength={2}
                        width={2}
                        value={amountFraction}
                        onChange={({ target: { value } }) => {
                          const v = Math.abs(+value.substr(0, 2));
                          if (v === 0) {
                            setAmountFraction('');
                          } else {
                            setAmountFraction((v as unknown) as string);
                          }
                        }}
                      />
                    </InputGroup>
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
                <FormGroup className="oneLine">
                  <Label for="paidWith">paid with</Label>
                  <ValueSelector
                    value={paidWith}
                    values={paymentMethods}
                    disabled={adding}
                    onSelect={value => setPaidWith(value ? value : '')}
                    onDelete={method => {
                      const m = remove(paymentMethods, method);
                      setPaymentMethods(m);
                      Cache.setItem('addSpending.paymentMethods', m);
                    }}
                    onAdd={value => {
                      const m = Array.from(
                        new Set([...paymentMethods, value]).values()
                      );
                      setPaymentMethods(m);
                      setPaidWith(value);
                      Cache.setItem('addSpending.paymentMethods', m);
                    }}
                  />
                </FormGroup>
              </CardBody>
              <CardFooter>
                <nav>
                  <Link to={`/account/${id}`}>cancel</Link>
                  {added && (
                    <Note>{isIncome ? 'Income' : 'Spending'} added.</Note>
                  )}
                  {error && (
                    <Fail>
                      Adding {isIncome ? 'Income' : 'Spending'} failed.
                    </Fail>
                  )}
                  <Button
                    disabled={adding || !isValid}
                    tabIndex={++tabIndex}
                    onClick={async () => {
                      setAdded(false);
                      setAdding(true);
                      setError(false);
                      createSpendingMutation({
                        variables: {
                          accountId: id,
                          bookedAt,
                          category,
                          description,
                          amount,
                          currencyId: currency,
                          isIncome,
                          isPending,
                          paidWith
                        }
                      }).then(
                        async ({
                          errors
                        }: { errors?: GraphQLError[] } | any) => {
                          if (errors) {
                            setError(true);
                            setAdding(false);
                          } else {
                            setAdded(true);
                            setAdding(false);
                            reset();
                          }
                        }
                      );
                    }}
                    color="primary"
                  >
                    Add
                  </Button>
                </nav>
              </CardFooter>
            </>
          )}
        </Mutation>
      </Card>
    </Form>
  );
};
