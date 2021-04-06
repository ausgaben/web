import React, { useState, useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import { Account, Spending } from "../schema";
import { ListingHeader } from "../ListingHeader/ListingHeader";
import { Note } from "../Note/Note";
import { Info } from "../Account/Info";
import { DateTime } from "luxon";
import { SpendingsList } from "./SpendingsList";
import { client } from "../App";
import { fetchExchangeRate } from "../ExchangeRates/fetchExchangeRate";
import { EUR } from "../currency/currencies";
import styled from "styled-components";
import { wideBreakpoint } from "../Styles";
import { summarizeSpendings } from "./Summary";
import { useLocation } from "react-router-dom";
import { Transactions } from "../Sparebank1/Transactions";
import { ImportSpendings } from "../Account/ImportSpendings";
import {
  createSpendingMutation,
  createSpendingMutationResult,
  createSpendingMutationVariables,
} from "../graphql/mutations/createSpending";

const ImportSpendingsSection = styled.section``;

const SpendingsSection = styled.section`
  & + & {
    @media (max-width: ${wideBreakpoint}) {
      margin-top: 1rem;
    }
  }
  ${ImportSpendingsSection} + & {
    display: none;
  }
`;

export type SpendingCategoryType = {
  spendings: (Spending & {
    amountInAccountDefaultCurrency: number;
  })[];
  totalInAccountDefaultCurrency: number;
  hasConversion: boolean;
};

export type SpendingsByCategoryType = {
  [key: string]: SpendingCategoryType;
};

export const SpendingsByCategory = ({
  spendings,
  account,
  nextMonth,
  next,
  prevMonth,
  startDate,
  refetch,
  variables,
}: {
  spendings: Spending[];
  account: Account;
  refetch: () => void;
  next?: () => void;
  prevMonth?: () => void;
  nextMonth?: () => void;
  children?: React.ReactNode;
  startDate: DateTime;
  variables: any;
}) => {
  return (
    <>
      <ListSpendings
        spendings={spendings}
        account={account}
        nextMonth={nextMonth}
        next={next}
        prevMonth={prevMonth}
        startDate={startDate}
        refetch={refetch}
        variables={variables}
      >
        {({ addSpending }) => {
          return (
            <ImportPreview
              addSpending={addSpending}
              account={account}
              startDate={startDate}
            />
          );
        }}
      </ListSpendings>
    </>
  );
};

const ListSpendings = ({
  spendings: s,
  account,
  nextMonth,
  next,
  prevMonth,
  startDate,
  refetch,
  variables,
  children,
}: {
  account: Account;
  spendings: Spending[];
  refetch: () => void;
  next?: () => void;
  prevMonth?: () => void;
  nextMonth?: () => void;
  children?: (args: {
    addSpending: (s: Spending) => void;
  }) => React.ReactElement;
  startDate: DateTime;
  variables: any;
}) => {
  const [spendings, setSpendings] = useState(s);
  const [categorizedSpendings, updateCategorizedSpendings] = useState<{
    booked: SpendingsByCategoryType;
    pending: SpendingsByCategoryType;
  }>({
    booked: {},
    pending: {},
  });

  const pendingSummary = summarizeSpendings({
    account,
    spendingsByCategory: categorizedSpendings.pending,
  });
  const bookedSummary = summarizeSpendings({
    account,
    spendingsByCategory: categorizedSpendings.booked,
    totalPendingInAccountDefaultCurrency:
      pendingSummary.totalSumInAccountDefaultCurrency,
  });

  useEffect(() => {
    let isMounted = true;
    const er = fetchExchangeRate(client);
    const spendingsByCategory: {
      booked: SpendingsByCategoryType;
      pending: SpendingsByCategoryType;
    } = {
      booked: {},
      pending: {},
    };
    spendings
      .reduce(
        (p, spending) =>
          p.then(async () => {
            const t = spending.booked ? "booked" : "pending";
            if (!spendingsByCategory[t][spending.category]) {
              spendingsByCategory[t][spending.category] = {
                spendings: [],
                totalInAccountDefaultCurrency: 0,
                hasConversion: false,
              };
            }
            let amountInAccountDefaultCurrency = spending.amount;

            if (spending.currency.id === account.defaultCurrency.id) {
              // Spending is in account currency => no conversion
              // pass
            } else if (spending.currency.id === EUR.id) {
              amountInAccountDefaultCurrency =
                (spending.amount * 1) /
                (await er(
                  account.defaultCurrency,
                  new Date(spending.bookedAt)
                ));
            } else {
              amountInAccountDefaultCurrency =
                spending.amount *
                (await er(spending.currency, new Date(spending.bookedAt)));
            }

            // Transfer from another account
            const isTransfer =
              spending.transferToAccount?._meta.id === account._meta.id;
            if (isTransfer) {
              amountInAccountDefaultCurrency *= -1;
            }

            spendingsByCategory[t][spending.category].spendings.push({
              ...spending,
              amountInAccountDefaultCurrency,
            });
            spendingsByCategory[t][
              spending.category
            ].totalInAccountDefaultCurrency += amountInAccountDefaultCurrency;
            if (spending.currency.id !== account.defaultCurrency.id) {
              spendingsByCategory[t][spending.category].hasConversion = true;
            }
          }),
        Promise.resolve()
      )
      .then(() => {
        if (isMounted) {
          updateCategorizedSpendings(spendingsByCategory);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [spendings, account]);

  return (
    <>
      <SpendingsSection>
        <Info account={account} />
        {Object.keys(categorizedSpendings.booked).length ? (
          <SpendingsList
            spendingsByCategory={categorizedSpendings.booked}
            header={
              <ListingHeader
                title={"Booked"}
                refetch={refetch}
                next={next}
                nextMonth={nextMonth}
                prevMonth={prevMonth}
                startDate={startDate}
              />
            }
            account={account}
            variables={variables}
            onUpdateSpendings={() => {
              // FIXME: Implement refresh
            }}
            booked={true}
            summary={bookedSummary}
          />
        ) : (
          <>
            <Card>
              <ListingHeader
                title={"Booked"}
                refetch={refetch}
                next={next}
                nextMonth={nextMonth}
                prevMonth={prevMonth}
                startDate={startDate}
              />
              <CardBody>
                <Note>No spendings found.</Note>
              </CardBody>
            </Card>
          </>
        )}
      </SpendingsSection>
      {children?.({
        addSpending: (s: Spending) => {
          setSpendings((spendings) => [...spendings, s]);
        },
      })}
      <SpendingsSection>
        {Object.keys(categorizedSpendings.pending).length ? (
          <SpendingsList
            spendingsByCategory={categorizedSpendings.pending}
            header={
              <ListingHeader
                title={"Pending"}
                refetch={refetch}
                next={next}
                nextMonth={nextMonth}
                prevMonth={prevMonth}
                startDate={startDate}
              />
            }
            account={account}
            variables={variables}
            onUpdateSpendings={() => {
              // FIXME: Implement refresh
            }}
            booked={false}
            summary={pendingSummary}
          />
        ) : null}
      </SpendingsSection>
    </>
  );
};

const ImportPreview = ({
  addSpending,
  account,
  startDate,
}: {
  account: Account;
  startDate: DateTime;
  addSpending: (s: Spending) => void;
}) => {
  const query = new URLSearchParams(useLocation().search);
  const [sparebank1ImportAccountId, setSparebank1ImportAccountId] = useState(
    query.get("sparebank1import")
  );
  return (
    <>
      {sparebank1ImportAccountId !== null && (
        <ImportSpendingsSection>
          <Transactions
            sparebankAccountId={sparebank1ImportAccountId}
            targetAccount={account}
            startDate={startDate}
          >
            {({ transactions }) => (
              <ImportSpendings
                onClose={() => setSparebank1ImportAccountId(null)}
                account={account}
                spendings={transactions}
                onSelect={(spending) => {
                  client
                    .mutate<
                      createSpendingMutationResult,
                      createSpendingMutationVariables
                    >({
                      mutation: createSpendingMutation,
                      variables: {
                        accountId: account._meta.id,
                        amount: spending.amount,
                        booked: true,
                        bookedAt: spending.bookedAt,
                        category: spending.category,
                        currencyId: spending.currency.id,
                        description: spending.description,
                      },
                    })
                    .then((res) => {
                      if (res.data) {
                        addSpending({
                          _meta: {
                            id: res.data?.createSpending.id ?? "",
                            name: "Spending",
                            version: 1,
                            createdAt: new Date(),
                          },
                          account: account,
                          amount: spending.amount,
                          booked: true,
                          bookedAt: spending.bookedAt,
                          category: spending.category,
                          currency: spending.currency,
                          description: spending.description,
                        });
                      }
                    });
                }}
              />
            )}
          </Transactions>
        </ImportSpendingsSection>
      )}
    </>
  );
};
