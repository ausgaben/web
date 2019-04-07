import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Table
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';
import { InviteUserToAccount } from './InviteUserToAccount';
import { Cache } from 'aws-amplify';
import { currenciesById, NOK } from '../currency/currencies';
import { FormatDate } from '../util/date/FormatDate';
import { FormatMoney } from '../util/date/FormatMoney';
import { DateTime } from 'luxon';
import { client } from '../App';
import { createSpendingMutation } from '../graphql/mutations/createSpending';

type ParsedSpending = {
  id: string;
  category: string;
  description: string;
  amount: number;
};

const importSpendings = (
  callback: (imported: string[]) => void,
  spendings: React.MutableRefObject<ParsedSpending[]>
) => {};

export const Import = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id: accountId }
    }
  } = props;

  const [adding, setAdding] = useState(false);
  const [importData, setImportData] = useState(
    Cache.getItem('importSpendings.importData') || ''
  );
  const [imported, setImported] = useState([] as string[]);
  const [spendingsToBeImported, setSpendingsToBeImported] = useState(
    [] as ParsedSpending[]
  );
  const bookedAt = DateTime.local().startOf('month');

  const spendings: ParsedSpending[] = importData
    .split('\n')
    .map((line: string) => {
      let [type, category, description, amount] = line.split('\t');
      if (!type || !category || !description || !amount) {
        return;
      }
      amount = amount.replace(/ €$/, '');
      const fracMatch = amount.match(/,([0-9]+)$/);
      const fraction = (fracMatch && fracMatch[1]) || '0';
      const wholeMatch = amount.match(/^(-?[0-9.]+)/);
      const whole = (wholeMatch && wholeMatch[1].replace('.', '')) || '0';
      const f = parseInt(whole, 10) * 100;
      let a = Math.abs(f) + parseInt(fraction, 10);
      if (a === 0) {
        return;
      }
      return {
        id: line,
        category,
        description,
        amount: f < 0 ? -a : a
      };
    })
    .filter((l: any) => l);

  const spendingsByCategory: {
    [key: string]: ParsedSpending[];
  } = spendings.reduce(
    (spendingsByCategory: { [key: string]: ParsedSpending[] }, spending) => {
      const { category } = spending;
      if (!spendingsByCategory[category]) {
        spendingsByCategory[category] = [];
      }
      spendingsByCategory[category].push(spending);
      return spendingsByCategory;
    },
    {}
  );

  useEffect(() => {
    if (spendingsToBeImported.length === 0) {
      return;
    }
    const i: string[] = [];
    spendingsToBeImported
      .reduce(
        (promise, { id, category, description, amount }) =>
          promise.then(async () => {
            await client.mutate({
              mutation: createSpendingMutation,
              variables: {
                accountId,
                bookedAt: bookedAt.toISODate(),
                category,
                description,
                amount: amount,
                currencyId: currenciesById.EUR.id,
                booked: false
              }
            });
            i.push(id);
          }),
        Promise.resolve()
      )
      .then(() => {
        setImported(i);
      });
  }, [spendingsToBeImported]);

  return (
    <Form>
      <Card>
        <CardHeader>
          <CardTitle>Import into {name}</CardTitle>
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label for="import">Import</Label>
            <Input
              disabled={adding}
              type="textarea"
              name="import"
              id="import"
              placeholder="e.g. 'Mat'"
              value={importData}
              required
              onChange={({ target: { value } }) => {
                setImportData(value);
                Cache.setItem('importSpendings.importData', value);
              }}
            />
          </FormGroup>
        </CardBody>
        <CardFooter>
          <Link to={`/account/${accountId}`}>⬅</Link>
        </CardFooter>
      </Card>
      {Object.keys(spendingsByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <Table className="spendings">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.keys(spendingsByCategory).map(cat => (
                <React.Fragment key={cat}>
                  <tr>
                    <th colSpan={4}>{cat}</th>
                  </tr>
                  {spendingsByCategory[cat].map(
                    ({ id, description, amount }, key) => (
                      <tr key={key} className="spending">
                        <td className="date">
                          <FormatDate date={bookedAt.toISODate()} />
                        </td>
                        <td className="description">{description}</td>
                        <td className="amount">
                          <FormatMoney
                            amount={amount}
                            symbol={currenciesById.EUR.symbol}
                          />
                        </td>
                        <td>{imported.includes(id) ? '✓' : '—'}</td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
          <CardFooter>
            <Link to={`/account/${accountId}`}>⬅</Link>
            <Button
              disabled={adding}
              onClick={async () => {
                setAdding(true);
                setSpendingsToBeImported(spendings);
              }}
              color="primary"
            >
              Import
            </Button>
          </CardFooter>
        </Card>
      )}
    </Form>
  );
};
