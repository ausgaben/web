import React, { useRef, useState } from "react";
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
  Label,
} from "reactstrap";
import { Fail, Note } from "../Note/Note";
import { Account, Spending } from "../schema";
import { Mutation } from "@apollo/client/react/components";
import { FetchResult } from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { currencies, NOK } from "../currency/currencies";
import { Cache } from "aws-amplify";
import { Link } from "react-router-dom";
import {
  createSpendingMutation,
  createSpendingMutationResult,
  createSpendingMutationVariables,
} from "../graphql/mutations/createSpending";
import {
  updatedSpendingMutation,
  updatedSpendingMutationResult,
  updatedSpendingMutationVariables,
} from "../graphql/mutations/updateSpending";
import { WithAccountAutoCompleteStrings } from "../AutoComplete/WithAccountAutoCompleteStrings";
import { Loading } from "../Loading/Loading";
import { AutoComplete } from "../AutoComplete/AutoComplete";

export const CreateSpendingForm = (props: {
  account: Account;
  savingsAccounts: Account[];
  spending?: Spending;
}) => (
  <Mutation<createSpendingMutationResult, createSpendingMutationVariables>
    mutation={createSpendingMutation}
  >
    {(createSpendingMutation, { loading, error }) => (
      <FormForSpending
        loading={loading}
        error={error}
        spending={props.spending}
        account={props.account}
        onSubmit={({ bookedAt, ...rest }) =>
          createSpendingMutation({
            variables: {
              ...rest,
              accountId: props.account._meta.id,
              bookedAt: bookedAt.toISOString(),
            },
          })
        }
        buttonLabel={"Add"}
        titleLabel={({ isIncome }) => (
          <>
            Add {isIncome ? "income" : "spending"} to{" "}
            <em>{props.account.name}</em>
          </>
        )}
        successLabel={({ isIncome }) => (
          <>{isIncome ? "Income" : "Spending"} added.</>
        )}
        errorLabel={({ isIncome }) => (
          <>Adding {isIncome ? "Income" : "Spending"} failed.</>
        )}
        savingsAccounts={props.savingsAccounts}
      />
    )}
  </Mutation>
);

export const UpdateSpendingForm = (props: {
  account: Account;
  savingsAccounts: Account[];
  spending: Spending;
}) => (
  <Mutation<updatedSpendingMutationResult, updatedSpendingMutationVariables>
    mutation={updatedSpendingMutation}
  >
    {(updateSpendingMutation, { loading, error }) => (
      <FormForSpending
        loading={loading}
        error={error}
        spending={props.spending}
        account={props.account}
        onSubmit={({ bookedAt, ...rest }) =>
          updateSpendingMutation({
            variables: {
              ...rest,
              bookedAt: bookedAt.toISOString(),
              spendingId: props.spending._meta.id,
            },
          })
        }
        resetOnSave={false}
        buttonLabel={"Update"}
        titleLabel={({ isIncome }) => (
          <>
            Edit {isIncome ? "income" : "spending"} in{" "}
            <em>{props.account.name}</em>
          </>
        )}
        successLabel={({ isIncome }) => (
          <>{isIncome ? "Income" : "Spending"} updated.</>
        )}
        errorLabel={({ isIncome }) => (
          <>Updating {isIncome ? "Income" : "Spending"} failed.</>
        )}
        savingsAccounts={props.savingsAccounts}
      />
    )}
  </Mutation>
);

const FormForSpending = ({
  loading,
  spending,
  account,
  onSubmit,
  error,
  buttonLabel,
  titleLabel,
  successLabel,
  errorLabel,
  resetOnSave,
  savingsAccounts,
}: {
  loading: boolean;
  spending?: Spending;
  account: Account;
  buttonLabel: string;
  titleLabel: (args: { isIncome: boolean }) => React.ReactElement;
  successLabel: (args: { isIncome: boolean }) => React.ReactElement;
  errorLabel: (args: { isIncome: boolean }) => React.ReactElement;
  onSubmit: (args: {
    bookedAt: Date;
    category: string;
    description: string;
    amount: number;
    currencyId: string;
    booked: boolean;
    savingForAccountId?: string;
  }) => Promise<FetchResult<unknown>>;
  error?: ApolloError;
  resetOnSave?: boolean;
  savingsAccounts: Account[];
}) => {
  const [added, setAdded] = useState(false);

  const [booked, setBooked] = useState(spending ? spending.booked : true);
  const [bookedAt, setBookedAt] = useState(
    spending ? new Date(spending.bookedAt) : new Date()
  );
  const [category, setCategory] = useState(spending ? spending.category : "");
  const [description, setDescription] = useState(
    spending ? spending.description : ""
  );

  const [savingForAccountId, setSavingForAccountId] = useState(
    spending?.savingForAccount?._meta.id ?? ""
  );

  const [isIncome, setIsIncome] = useState(
    spending ? spending.amount > 0 : false
  );

  const isSaving = !isIncome && savingForAccountId.length;

  const [amountWholeInput, setAmountWholeInput] = useState(
    spending ? Math.floor(Math.abs(spending.amount) / 100) : ""
  );
  const [amountFractionInput, setAmountFractionInput] = useState(
    spending ? Math.abs(spending.amount % 100) : ""
  );
  const amountWhole = useRef(
    spending ? Math.floor(Math.abs(spending.amount) / 100) : 0
  );
  const amountFraction = useRef(spending ? Math.abs(spending.amount % 100) : 0);
  const [currency, setCurrency] = useState(
    spending
      ? spending.currency.id
      : Cache.getItem("addSpending.currency") || NOK.id
  );
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const amount = amountWhole.current * 100 + amountFraction.current;

  const isValid = category.length && description.length && amount > 0;

  const reset = () => {
    if (!(resetOnSave ?? true)) return;
    setDescription("");
    setAmountWholeInput("");
    setAmountFractionInput("");
    amountWhole.current = 0;
    amountFraction.current = 0;
  };

  let tabIndex = 0;
  return (
    <WithAccountAutoCompleteStrings account={account} loading={<Loading />}>
      {({ autoCompleteStrings }) => (
        <Form className="addSpending">
          <Card>
            <CardHeader>
              <CardTitle>{titleLabel({ isIncome })}</CardTitle>
            </CardHeader>
            <CardBody>
              <FormGroup className="oneLine">
                <Label for="bookedAt">Date</Label>
                <InputGroup>
                  <Input
                    tabIndex={++tabIndex}
                    disabled={loading}
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
                  disabled={loading}
                  tabIndex={++tabIndex}
                  name="category"
                  id="category"
                  placeholder="e.g. 'Mat'"
                  value={category}
                  required
                  onChange={(value) => setCategory(value)}
                  strings={autoCompleteStrings.category}
                />
              </FormGroup>
              <FormGroup className="oneLine">
                <Label for="description">Description</Label>
                <AutoComplete
                  disabled={loading}
                  tabIndex={++tabIndex}
                  name="description"
                  id="description"
                  placeholder="e.g. 'Rema 1000'"
                  value={description}
                  required
                  onChange={(v) => setDescription(v)}
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
                              Cache.setItem("addSpending.currency", id);
                            }}
                          >
                            {id}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                    <Input
                      disabled={loading}
                      tabIndex={++tabIndex}
                      type="text"
                      pattern="^[0-9]+"
                      name="amountWhole"
                      id="amountWhole"
                      value={amountWholeInput}
                      placeholder="e.g. '27'"
                      required
                      onChange={({ target: { value } }) => {
                        const v = value.replace(/[^0-9]/g, "");
                        setAmountWholeInput(v);
                        amountWhole.current = Math.abs(+v);
                      }}
                      autoComplete="off"
                    />
                    <InputGroupAddon
                      addonType="append"
                      style={{ marginRight: -1 }}
                    >
                      <InputGroupText>.</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      disabled={loading}
                      tabIndex={++tabIndex}
                      pattern="^[0-9]{0,2}"
                      name="amountFraction"
                      id="amountFraction"
                      placeholder="e.g. '99'"
                      maxLength={2}
                      width={2}
                      value={amountFractionInput}
                      onChange={({ target: { value } }) => {
                        const v = value.replace(/[^0-9]/g, "");
                        setAmountFractionInput(v);
                        amountFraction.current = Math.abs(
                          +`${v}00`.slice(0, 2)
                        );
                      }}
                      autoComplete="off"
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <FormGroup className="oneLine">
                <Label>Type</Label>
                <ButtonGroup>
                  <Button
                    color={isSaving ? "warning" : "danger"}
                    outline={isIncome}
                    onClick={() => setIsIncome(false)}
                  >
                    {isSaving ? "Saving" : "Spending"}
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
              {!account.isSavingsAccount && (
                <FormGroup className="oneLine">
                  <Label for="saving">Saving towards</Label>
                  <Input
                    type="select"
                    name="saving"
                    id="saving"
                    disabled={loading || isIncome}
                    onChange={({ target: { value } }) =>
                      setSavingForAccountId(value)
                    }
                    value={savingForAccountId}
                  >
                    <option value="">None</option>
                    {!isIncome &&
                      savingsAccounts.map((account) => (
                        <option value={account._meta.id} key={account._meta.id}>
                          {account.name}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              )}
            </CardBody>
            <CardFooter>
              <Link to={`/account/${account._meta.id}`}>⬅</Link>
              {added && <Note>{successLabel({ isIncome })}</Note>}
              {error && <Fail>{errorLabel({ isIncome })}</Fail>}
              <Button
                disabled={loading || !isValid}
                tabIndex={++tabIndex}
                onClick={async () => {
                  setAdded(false);
                  const res = await onSubmit({
                    bookedAt: bookedAt,
                    category: category.trim(),
                    description: description.trim(),
                    amount: isIncome ? amount : -amount,
                    currencyId: currency,
                    booked,
                    savingForAccountId: isSaving
                      ? savingForAccountId
                      : undefined,
                  });
                  if (res && !res.errors) {
                    setAdded(true);
                    reset();
                  }
                }}
                color="primary"
              >
                {buttonLabel}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </WithAccountAutoCompleteStrings>
  );
};
