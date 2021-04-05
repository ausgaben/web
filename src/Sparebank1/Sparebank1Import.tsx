import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { client } from "../App";
import { Account, Spending } from "../schema";
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

export const Sparebank1Import = ({
  onTransactions,
}: {
  onTransactions?: (transactions: Spending[]) => unknown;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [importAccount, setImportAccount] = useState<string>();
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
        setImportAccount(res.data.sparebank1accounts.items[0]._meta.id);
      });
  }, []);
  if (accounts.length === 0) return null;

  return (
    <StyledFormGroup>
      <Input
        type={"select"}
        value={importAccount}
        onChange={({ target: { value } }) => {
          setImportAccount(value);
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
        disabled={(importAccount?.length ?? 0) <= 0}
        onClick={() => {
          client
            .query<
              {
                sparebank1transactions: { items: Spending[] };
              },
              { accountId: string }
            >({
              query: gql`
                query sparebank1transactions($accountId: ID!) {
                  sparebank1transactions(accountId: $accountId) {
                    items {
                      _meta {
                        id
                      }
                      bookedAt
                      booked
                      category
                      description
                      amount
                      currency {
                        id
                        symbol
                      }
                    }
                    nextStartKey
                  }
                }
              `,
              variables: {
                accountId: importAccount as string,
              },
              fetchPolicy: "no-cache",
            })
            .then(
              ({
                data: {
                  sparebank1transactions: { items: transactions },
                },
              }) => {
                onTransactions?.(transactions);
              }
            );
        }}
      >
        Import
      </Button>
    </StyledFormGroup>
  );
};
