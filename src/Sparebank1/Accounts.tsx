import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { client } from "../App";
import { Account } from "../schema";
import { Input, FormGroup, Button } from "reactstrap";
import styled from "styled-components";

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  select {
    flex-grow: 1;
  }
  button {
    margin-left: 1rem;
  }
`;

export const Accounts = ({
  onSelect,
}: {
  onSelect?: (account: Account) => unknown;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [importAccount, setImportAccount] = useState<Account>();
  useEffect(() => {
    client
      .query<{ sparebank1accounts: { items: Account[] } }>({
        query: gql`
          query sparebank1accounts {
            sparebank1accounts {
              items {
                name
                isSavingsAccount
                defaultCurrency {
                  id
                  symbol
                }
                _meta {
                  id
                  version
                }
              }
            }
          }
        `,
      })
      .then((res) => {
        setAccounts(res.data.sparebank1accounts.items);
        setImportAccount(res.data.sparebank1accounts.items[0]);
      });
  }, []);
  if (accounts.length === 0) return null;

  return (
    <StyledFormGroup>
      <Input
        type={"select"}
        value={importAccount?._meta.id}
        onChange={({ target: { value } }) => {
          setImportAccount(accounts.find(({ _meta: { id } }) => id === value));
        }}
      >
        {accounts.map(({ name, _meta: { id } }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </Input>
      <Button
        type="button"
        disabled={importAccount === undefined || (accounts?.length ?? 0) <= 0}
        onClick={() => {
          onSelect?.(importAccount as Account);
        }}
      >
        Import
      </Button>
    </StyledFormGroup>
  );
};
