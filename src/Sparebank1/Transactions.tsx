import gql from "graphql-tag";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { client } from "../App";
import { Note } from "../Note/Note";
import { Account, Spending } from "../schema";

export const Transactions = ({
  sparebankAccountId,
  startDate,
  children,
}: {
  sparebankAccountId: string;
  targetAccount: Account;
  startDate: DateTime;
  children: (args: { transactions: Spending[] }) => React.ReactElement;
}) => {
  const [transactions, setTransactions] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
          accountId: sparebankAccountId,
        },
        fetchPolicy: "cache-first",
      })
      .then(({ data }) => {
        setLoading(false);
        if (data !== null) {
          const {
            sparebank1transactions: { items },
          } = data;
          const endOfMonth = startDate.endOf("month");
          setTransactions(
            items.filter(({ bookedAt }) => {
              const b = DateTime.fromISO(bookedAt);
              return b >= startDate && b <= endOfMonth;
            })
          );
        }
      });
  }, [sparebankAccountId, startDate]);

  if (loading) return <Note>Loading ...</Note>;
  if (transactions.length === 0) return null;

  return children({ transactions });
};
