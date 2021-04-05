import React, { useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "reactstrap";
import { Account, Spending } from "../schema";
import { FormatDate } from "../util/date/FormatDate";
import { FormatMoney } from "../util/date/FormatMoney";
import { SpendingsTable } from "../Spendings/SpendingsList";
import { WithAccountAutoCompleteStrings } from "../AutoComplete/WithAccountAutoCompleteStrings";
import { Note } from "../Note/Note";
import styled from "styled-components";

const SpendingsTableWithAction = styled(SpendingsTable)`
  td.description {
    width: 50%;
  }
`;
const Action = styled.td``;

const Table = ({
  spendings,
  action,
}: {
  spendings: Spending[];
  action?: (spending: Spending) => React.ReactElement;
}) => {
  const spendingByCategory: {
    [key: string]: Spending[];
  } = spendings.reduce(
    (spendingsByCategory: { [key: string]: Spending[] }, spending) => {
      const { category } = spending;
      if (!spendingsByCategory[category]) {
        spendingsByCategory[category] = [];
      }
      spendingsByCategory[category].push(spending);
      return spendingsByCategory;
    },
    {}
  );
  return (
    <SpendingsTableWithAction>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.keys(spendingByCategory).map((cat) => (
          <React.Fragment key={cat}>
            <tr>
              <th colSpan={4}>{cat}</th>
            </tr>
            {spendingByCategory[cat]
              .sort(
                ({ bookedAt: b1 }, { bookedAt: b2 }) =>
                  new Date(b1).getTime() - new Date(b2).getTime()
              )
              .map(
                (
                  { _meta: { id }, description, amount, bookedAt, currency },
                  key
                ) => (
                  <tr key={key} className="spending">
                    <td className="date">
                      <FormatDate date={bookedAt} />
                    </td>
                    <td className="description">{description}</td>
                    <td className="amount">
                      <FormatMoney amount={amount} symbol={currency.symbol} />
                    </td>
                    <Action>
                      {action?.(
                        spendings.find(
                          ({ _meta: { id: sId } }) => sId === id
                        ) as Spending
                      )}
                    </Action>
                  </tr>
                )
              )}
          </React.Fragment>
        ))}
      </tbody>
    </SpendingsTableWithAction>
  );
};

export const ImportSpendings = ({
  account,
  spendings,
}: {
  account: Account;
  spendings: Spending[];
}) => {
  const [adding, setAdding] = useState(false);
  const [importedSpendings, setImportedSpendings] = useState(spendings);
  const [spendingsToBeImported, setSpendingsToBeImported] = useState<
    Spending[]
  >([]);

  return (
    <>
      {spendingsToBeImported.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <Table spendings={spendingsToBeImported} />
          <CardFooter>
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
      {importedSpendings.length > 0 && (
        <WithAccountAutoCompleteStrings
          account={account}
          loading={<Note>Loading...</Note>}
        >
          {({ autoCompleteStrings: { category } }) => (
            <Card>
              <CardHeader>
                <CardTitle>Imported</CardTitle>
              </CardHeader>
              <Table
                spendings={importedSpendings}
                action={(spending) => (
                  <Input
                    type="select"
                    value={spending.category}
                    onChange={({ target: { value } }) => {
                      const pos = importedSpendings.indexOf(spending);
                      setImportedSpendings([
                        ...importedSpendings.slice(0, pos),
                        ...importedSpendings.slice(pos + 1),
                      ]);
                      setSpendingsToBeImported((s) => [
                        ...s,
                        {
                          ...spending,
                          category: value,
                        },
                      ]);
                    }}
                  >
                    <option>&mdash; (None)</option>
                    {category.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Input>
                )}
              />
            </Card>
          )}
        </WithAccountAutoCompleteStrings>
      )}
    </>
  );
};
