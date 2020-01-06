import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Account, Spending } from '../schema';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { Note } from '../Note/Note';
import { Info } from '../Account/Info';
import { DateTime } from 'luxon';
import { SpendingsList } from './SpendingsList';
import { client } from '../App';
import { fetchExchangeRate } from '../ExchangeRates/fetchExchangeRate';
import { EUR } from '../currency/currencies';
import styled from 'styled-components';
import { wideBreakpoint } from '../Styles';

const SpendingsSection = styled.section`
  & + & {
    @media (max-width: ${wideBreakpoint}) {
      margin-top: 1rem;
    }
  }
`;

export type SpendingCategory = {
  spendings: (Spending & {
    amountInAccountDefaultCurrency: number;
  })[];
  totalInAccountDefaultCurrency: number;
  hasConversion: boolean;
};

export type SpendingsByCategory = {
  [key: string]: SpendingCategory;
};

export const SpendingsByCategory = ({
  spendings,
  nextMonth,
  next,
  prevMonth,
  startDate,
  refetch,
  account,
  variables
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
    booked: SpendingsByCategory;
    pending: SpendingsByCategory;
  }>({
    booked: {},
    pending: {}
  });

  useEffect(() => {
    let isMounted = true;
    const er = fetchExchangeRate(client);
    const spendingsByCategory: {
      booked: SpendingsByCategory;
      pending: SpendingsByCategory;
    } = {
      booked: {},
      pending: {}
    };
    spendings
      .reduce(
        (p, spending) =>
          p.then(async () => {
            const t = spending.booked ? 'booked' : 'pending';
            if (!spendingsByCategory[t][spending.category]) {
              spendingsByCategory[t][spending.category] = {
                spendings: [],
                totalInAccountDefaultCurrency: 0,
                hasConversion: false
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

            spendingsByCategory[t][spending.category].spendings.push({
              ...spending,
              amountInAccountDefaultCurrency
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
      <Card>
        <ListingHeader
          title={'Booked'}
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
    );
  }

  return (
    <>
      <SpendingsSection>
        <Info account={account} />
        {Object.keys(categorizedSpendings.booked).length ? (
          <SpendingsList
            spendingsByCategory={categorizedSpendings.booked}
            header={
              <ListingHeader
                title={'Booked'}
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
          />
        ) : null}
      </SpendingsSection>
      <SpendingsSection>
        {Object.keys(categorizedSpendings.pending).length ? (
          <SpendingsList
            spendingsByCategory={categorizedSpendings.pending}
            header={
              <ListingHeader
                title={'Pending'}
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
          />
        ) : null}
      </SpendingsSection>
    </>
  );
};
