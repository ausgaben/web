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
import { Account } from "../schema";
import { Link } from "react-router-dom";
import { Cache } from "aws-amplify";
import { Accounts as Sparebank1Accounts } from "../Sparebank1/Accounts";
import { ImportStubs } from "./ImportStubs";
import { useHistory } from "react-router-dom";

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

  const history = useHistory();

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
            <Sparebank1Accounts
              onSelect={(account) => {
                console.log(account);
                history.push(
                  `/account/${accountId}?sparebank1import=${account._meta.id}`
                );
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
    </Form>
  );
};
