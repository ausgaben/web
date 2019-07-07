import React, { useRef, useState } from 'react';
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
import { Fail, Note } from '../Note/Note';
import { Account, Spending } from '../schema';
import { Mutation } from 'react-apollo';
import { GraphQLError } from 'graphql';
import { currencies, currenciesById, NOK } from '../currency/currencies';
import { Cache } from 'aws-amplify';
import { ValueSelector } from '../ValueSelector/ValueSelector';
import { Link } from 'react-router-dom';
import {
  allTime,
  month,
  spendingsQuery
} from '../graphql/queries/spendingsQuery';
import { createSpendingMutation } from '../graphql/mutations/createSpending';
import { WithAccountAutoCompleteStrings } from '../AutoComplete/WithAccountAutoCompleteStrings';
import { Loading } from '../Loading/Loading';
import { AutoComplete } from '../AutoComplete/AutoComplete';

class CreateSpendingMutation extends Mutation<
  {
    createSpending: { id: string };
  },
  {
    accountId: string;
    bookedAt: string;
    category: string;
    description: string;
    amount: number;
    currencyId: string;
    booked: boolean;
    paidWith?: string;
  }
> {}

export const AddSpending = (props: { account: Account; copy?: Spending }) => {
  const {
    account: {
      name,
      isSavingsAccount,
      _meta: { id: accountId }
    },
    copy
  } = props;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [isIncome, setIsIncome] = useState(copy ? copy.amount > 0 : false);
  const [booked, setBooked] = useState(copy ? copy.booked : true);
  const [bookedAt, setBookedAt] = useState(
    copy ? new Date(copy.bookedAt) : new Date()
  );
  const [category, setCategory] = useState(copy ? copy.category : '');
  const [description, setDescription] = useState(copy ? copy.description : '');
  const [paidWith, setPaidWith] = useState(copy ? `${copy.paidWith}` : '');
  if (copy) {
  }
  const [amountWholeInput, setAmountWholeInput] = useState(
    copy ? Math.floor(Math.abs(copy.amount) / 100) : ''
  );
  const [amountFractionInput, setAmountFractionInput] = useState(
    copy ? Math.abs(copy.amount % 100) : ''
  );
  const amountWhole = useRef(
    copy ? Math.floor(Math.abs(copy.amount) / 100) : 0
  );
  const amountFraction = useRef(copy ? Math.abs(copy.amount % 100) : 0);
  const [currency, setCurrency] = useState(
    copy ? copy.currency.id : Cache.getItem('addSpending.currency') || NOK.id
  );
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const amount = amountWhole.current * 100 + amountFraction.current;

  const isValid = category.length && description.length && amount > 0;

  const reset = () => {
    setDescription('');
    setAmountWholeInput('');
    setAmountFractionInput('');
    amountWhole.current = 0;
    amountFraction.current = 0;
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
        <WithAccountAutoCompleteStrings
          account={props.account}
          loading={<Loading />}
        >
          {({ autoCompleteStrings, refetch: refetchAutoCompleteStrings }) => (
            <CreateSpendingMutation
              mutation={createSpendingMutation}
              update={(cache, { data }) => {
                const {
                  createSpending: { id }
                } = data!;
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
                refetchAutoCompleteStrings();
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
                          onChange={({ target: { value } }) => {
                            const d = Date.parse(value);
                            if (d) {
                              const bookedAt = new Date(d);
                              setBookedAt(bookedAt);
                              setBooked(bookedAt.getTime() <= Date.now());
                            }
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button
                            color="warning"
                            outline={booked}
                            onClick={() => setBooked(false)}
                            title="Pending"
                          >
                            <span role="img" aria-label="hourglass">
                              ⏳
                            </span>
                          </Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <Button
                            color="success"
                            outline={!booked}
                            onClick={() => setBooked(true)}
                            title="Booked"
                          >
                            <span role="img" aria-label="checkmark">
                              ✓
                            </span>
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup className="oneLine">
                      <Label for="category">Category</Label>
                      <AutoComplete
                        disabled={adding}
                        tabIndex={++tabIndex}
                        name="category"
                        id="category"
                        placeholder="e.g. 'Mat'"
                        value={category}
                        required
                        onChange={value => setCategory(value)}
                        strings={autoCompleteStrings.category}
                      />
                    </FormGroup>
                    <FormGroup className="oneLine">
                      <Label for="description">Description</Label>
                      <AutoComplete
                        disabled={adding}
                        tabIndex={++tabIndex}
                        name="description"
                        id="description"
                        placeholder="e.g. 'Rema 1000'"
                        value={description}
                        required
                        onChange={v => setDescription(v)}
                        strings={autoCompleteStrings.categories[category] || []}
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
                            type="text"
                            pattern="^[0-9]+"
                            name="amountWhole"
                            id="amountWhole"
                            value={amountWholeInput}
                            placeholder="e.g. '27'"
                            required
                            onChange={({ target: { value } }) => {
                              const v = value.replace(/[^0-9]/g, '');
                              setAmountWholeInput(v);
                              amountWhole.current = Math.abs(+v);
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
                            pattern="^[0-9]{0,2}"
                            name="amountFraction"
                            id="amountFraction"
                            placeholder="e.g. '99'"
                            maxLength={2}
                            width={2}
                            value={amountFractionInput}
                            onChange={({ target: { value } }) => {
                              const v = value.replace(/[^0-9]/g, '');
                              setAmountFractionInput(v);
                              amountFraction.current = Math.abs(
                                +`${v}00`.slice(0, 2)
                              );
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
                        values={autoCompleteStrings.paidWith}
                        disabled={adding}
                        onSelect={value => setPaidWith(value ? value : '')}
                        onAdd={value => {
                          setPaidWith(value);
                        }}
                      />
                    </FormGroup>
                  </CardBody>
                  <CardFooter>
                    <Link to={`/account/${accountId}`}>⬅</Link>
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
                            accountId,
                            bookedAt: bookedAt.toISOString(),
                            category: category.trim(),
                            description: description.trim(),
                            amount: isIncome ? amount : -amount,
                            currencyId: currency,
                            booked,
                            ...(paidWith.length && { paidWith })
                          }
                        }).then(
                          async ({
                            errors
                          }: { errors?: GraphQLError[] } | any) => {
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
            </CreateSpendingMutation>
          )}
        </WithAccountAutoCompleteStrings>
      </Card>
    </Form>
  );
};
