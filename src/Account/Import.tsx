import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Account } from "../schema";
import { Link } from "react-router-dom";
import { Cache } from "aws-amplify";
import { currenciesById } from "../currency/currencies";
import { FormatDate } from "../util/date/FormatDate";
import { FormatMoney } from "../util/date/FormatMoney";
import { DateTime } from "luxon";
import { client } from "../App";
import { createSpendingMutation } from "../graphql/mutations/createSpending";
import { SpendingsTable } from "../Spendings/SpendingsList";

type ParsedSpending = {
  id: string;
  category: string;
  description: string;
  currencyId: string;
  amount: number;
  dayOfMonth: number;
  bookedAt: DateTime;
};

const trim = (s: string) => s.trim();

export const Import = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id: accountId },
    },
  } = props;

  const [adding, setAdding] = useState(false);
  const [importData, setImportData] = useState(
    Cache.getItem("importSpendings.importData") || ""
  );
  const [imported, setImported] = useState([] as string[]);
  const [spendingsToBeImported, setSpendingsToBeImported] = useState(
    [] as ParsedSpending[]
  );
  const spendings: ParsedSpending[] = importData
    .split("\n")
    .map(trim)
    .map((line: string) => {
      let [
        type,
        category,
        description,
        currency,
        amount,
        dayOfMonth,
      ] = line.split("\t").map(trim);
      if (
        !type ||
        !category ||
        !description ||
        !amount ||
        !currency ||
        !dayOfMonth
      ) {
        return undefined;
      }
      amount = amount.replace(/ €$/, "");
      const fracMatch = amount.match(/,([0-9]+)$/);
      const fraction = (fracMatch && fracMatch[1]) || "0";
      const wholeMatch = amount.match(/^(-?[0-9.]+)/);
      const whole = (wholeMatch && wholeMatch[1].replace(".", "")) || "0";
      const f = parseInt(whole, 10) * 100;
      let a = Math.abs(f) + parseInt(fraction, 10);
      if (a === 0) {
        return undefined;
      }
      return {
        id: line,
        category,
        description,
        amount: f < 0 ? -a : a,
        bookedAt: DateTime.local()
          .startOf("month")
          .set({ day: parseInt(dayOfMonth, 10) }),
        currencyId: currenciesById[currency]
          ? currenciesById[currency].id
          : currenciesById.EUR.id,
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
        (
          promise,
          { id, category, description, amount, bookedAt, currencyId }
        ) =>
          promise.then(async () => {
            await client.mutate({
              mutation: createSpendingMutation,
              variables: {
                accountId,
                bookedAt: bookedAt.toISODate(),
                category,
                description,
                amount: amount,
                currencyId,
                booked: false,
              },
            });
            i.push(id);
          }),
        Promise.resolve()
      )
      .then(() => {
        setImported(i);
      });
  }, [spendingsToBeImported, accountId]);

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
              placeholder="Type	Category	Title	Currency	Value	Day of Month
Vorsorge	Versicherungen	Allianz - Lebensversicherung	EUR	-197,86	1"
              value={importData}
              required
              onChange={({ target: { value } }) => {
                setImportData(value);
                Cache.setItem("importSpendings.importData", value);
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
          <SpendingsTable>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.keys(spendingsByCategory).map((cat) => (
                <React.Fragment key={cat}>
                  <tr>
                    <th colSpan={4}>{cat}</th>
                  </tr>
                  {spendingsByCategory[cat]
                    .sort(
                      ({ bookedAt: b1 }, { bookedAt: b2 }) =>
                        b1.toJSDate().getTime() - b2.toJSDate().getTime()
                    )
                    .map(
                      (
                        { id, description, amount, bookedAt, currencyId },
                        key
                      ) => (
                        <tr key={key} className="spending">
                          <td className="date">
                            <FormatDate date={bookedAt.toISODate() as string} />
                          </td>
                          <td className="description">{description}</td>
                          <td className="amount">
                            <FormatMoney
                              amount={amount}
                              symbol={currenciesById[currencyId].symbol}
                            />
                          </td>
                          <td>{imported.includes(id) ? "✓" : "—"}</td>
                        </tr>
                      )
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </SpendingsTable>
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
