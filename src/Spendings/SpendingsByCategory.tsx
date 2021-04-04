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

const SpendingsSection = styled.section`
  & + & {
    @media (max-width: ${wideBreakpoint}) {
      margin-top: 1rem;
    }
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
  nextMonth,
  next,
  prevMonth,
  startDate,
  refetch,
  account,
  variables,
}: {
  spendings: Spending[];
  account: Account;
  refetch: () => void;
  next?: () => void;
  prevMonth?: () => void;
  nextMonth?: () => void;
  children?: React.ReactNode;
  startDate?: DateTime;
  variables: any;
}) => {
  const [categorizedSpendings, updateCategorizedSpendings] = useState<{
    booked: SpendingsByCategoryType;
    pending: SpendingsByCategoryType;
  }>({
    booked: {},
    pending: {},
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

            // Saving from another account
            const isSavingIncome =
              spending.savingForAccount?._meta.id === account._meta.id;
            if (isSavingIncome) {
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

  if (!spendings.length) {
    return (
      <>
        <Info account={account} />
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
    );
  }

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
        ) : null}
      </SpendingsSection>
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
