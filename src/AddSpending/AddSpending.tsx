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
import { Account, Spending } from '../schema';
import { Mutation } from 'react-apollo';
import { GraphQLError } from 'graphql';
import { currencies, currenciesById, NOK } from '../currency/currencies';
import { Cache } from 'aws-amplify';
import { remove } from '../util/splice';
import { ValueSelector } from '../ValueSelector/ValueSelector';
import { Link } from 'react-router-dom';
import {
  allTime,
  month,
  spendingsQuery
} from '../graphql/queries/spendingsQuery';

export const createSpendingQuery = gql`
  mutation createSpending(
    $accountId: ID!
    $bookedAt: String!
    $booked: Boolean
    $category: String!
    $description: String!
    $amount: Int!
    $currencyId: ID!
    $paidWith: String
  ) {
    createSpending(
      accountId: $accountId
      bookedAt: $bookedAt
      booked: $booked
      category: $category
      description: $description
      amount: $amount
      currencyId: $currencyId
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
      isSavingsAccount,
      _meta: { id: accountId }
    }
  } = props;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [booked, setBooked] = useState(true);
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
    setBooked(true);
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
        <Mutation
          mutation={createSpendingQuery}
          update={(
            cache,
            {
              data: {
                createSpending: { id }
              }
            }
          ) => {
            const { startDate, endDate } = isSavingsAccount
              ? allTime()
              : month();
            const res = cache.readQuery<{
              spendings: {
                items: Spending[];
              };
            }>({
              query: spendingsQuery,
              variables: {
                accountId,
                startDate: startDate.toISO(),
                endDate: endDate.toISO()
              }
            });
            if (res) {
              const {
                spendings: { items: spendings }
              } = res;
              const newSpendings = [
                ...spendings,
                {
                  accountId,
                  bookedAt: bookedAt.toISOString(),
                  category,
                  description,
                  amount: isIncome ? amount : -amount,
                  currency: {
                    ...currenciesById[currency],
                    __typename: 'Currency'
                  },
                  booked,
                  paidWith: paidWith.length ? paidWith : null,
                  _meta: {
                    id,
                    __typename: 'EntityMeta'
                  },
                  __typename: 'Spending'
                }
              ] as Spending[];
              newSpendings.sort(({ bookedAt: a }, { bookedAt: b }) =>
                b.localeCompare(a)
              );
              cache.writeQuery({
                query: spendingsQuery,
                variables: {
                  accountId,
                  startDate: startDate.toISO(),
                  endDate: endDate.toISO()
                },
                data: {
                  ...res,
                  spendings: {
                    ...res.spendings,
                    items: newSpendings
                  }
                }
              });
            }
            setAdded(true);
            setAdding(false);
            reset();
          }}
        >
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
                        outline={booked}
                        onClick={() => setBooked(false)}
                        title="Pending"
                      >
                        ⏳
                      </Button>
                    </InputGroupAddon>
                    <InputGroupAddon addonType="append">
                      <Button
                        color="success"
                        outline={!booked}
                        onClick={() => setBooked(true)}
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
                        value={amountWhole}
                        placeholder="e.g. '27'"
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
                        placeholder="e.g. '99'"
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
                <Link to={`/account/${accountId}`}>cancel</Link>
                {added && (
                  <Note>{isIncome ? 'Income' : 'Spending'} added.</Note>
                )}
                {error && (
                  <Fail>Adding {isIncome ? 'Income' : 'Spending'} failed.</Fail>
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
                        accountId,
                        bookedAt: bookedAt.toISOString(),
                        category,
                        description,
                        amount: isIncome ? amount : -amount,
                        currencyId: currency,
                        booked,
                        ...(paidWith.length && { paidWith })
                      }
                    }).then(
                      async ({ errors }: { errors?: GraphQLError[] } | any) => {
                        if (errors) {
                          setError(true);
                          setAdding(false);
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
      </Card>
    </Form>
  );
};
