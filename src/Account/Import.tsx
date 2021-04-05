import React, { useState } from "react";
import {
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
import { Account, Spending } from "../schema";
import { Link } from "react-router-dom";
import { Cache } from "aws-amplify";
import { Sparebank1Import } from "../Sparebank1/Sparebank1Import";
import { ImportStubs } from "./ImportStubs";
import { ImportSpendings } from "./ImportSpendings";

export const Import = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id: accountId },
    },
  } = props;

  const [importData, setImportData] = useState(
    Cache.getItem("importSpendings.importData") || ""
  );

  const [importSpendings, setImportSpendings] = useState<Spending[]>([]);

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
          {process.env.REACT_APP_SPAREBANK1_API_CLIENT_ID !== undefined && (
            <Sparebank1Import
              onTransactions={(transactions) => {
                setImportSpendings(transactions.slice(0, 10));
              }}
            />
          )}
        </CardBody>
        <CardFooter>
          <Link to={`/account/${accountId}`}>⬅</Link>
        </CardFooter>
      </Card>
      {importData.length > 0 && (
        <ImportStubs account={props.account} importData={importData} />
      )}
      {importSpendings.length > 0 && (
        <ImportSpendings account={props.account} spendings={importSpendings} />
      )}
    </Form>
  );
};
