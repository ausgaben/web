import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Account, Spending } from '../schema';
import { ListingHeader } from '../ListingHeader/ListingHeader';
import { currencies, currenciesById } from '../currency/currencies';
import { Note } from '../Note/Note';
import { Info } from '../Account/Info';
import { DateTime } from 'luxon';
import { SpendingsList } from './SpendingsList';

export type SpendingCategory = {
  spendings: Spending[];
  sums: { [key: string]: number };
  counts: { [key: string]: number };
};

export type SpendingsByCategory = {
  [key: string]: SpendingCategory;
};

export const SpendingsByCategory = (props: {
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
  const [displaySpendings, updateDisplaySpendings] = useState(props.spendings);
  const {
    nextMonth,
    next,
    prevMonth,
    startDate,
    refetch,
    account,
    variables
  } = props;
  if (!displaySpendings.length) {
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

  const spendingsByCategory = displaySpendings.reduce(
    (spendingsByCategory, spending) => {
      const t = spending.booked ? 'booked' : 'pending';
      if (!spendingsByCategory[t][spending.category]) {
        spendingsByCategory[t][spending.category] = {
          spendings: [],
          sums: {},
          counts: {}
        };
        currencies.forEach(currency => {
          spendingsByCategory[t][spending.category].sums[currency.id] = 0;
          spendingsByCategory[t][spending.category].counts[currency.id] = 0;
        });
      }
      spendingsByCategory[t][spending.category].spendings.push(spending);

      spendingsByCategory[t][spending.category].sums[currenciesById.EUR.id] +=
        spending.amount * spending.currency.toEUR;
      if (spending.currency.id !== currenciesById.EUR.id) {
        spendingsByCategory[t][spending.category].sums[spending.currency.id] +=
          spending.amount;
      }

      spendingsByCategory[t][spending.category].counts[spending.currency.id]++;
      return spendingsByCategory;
    },
    {
      booked: {},
      pending: {}
    } as {
      booked: SpendingsByCategory;
      pending: SpendingsByCategory;
    }
  );

  return (
    <>
      <section>
        <Info account={props.account} />
        {Object.keys(spendingsByCategory.booked).length ? (
          <SpendingsList
            spendingsByCategory={spendingsByCategory.booked}
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
            accountId={account._meta.id}
            variables={variables}
            onUpdateSpendings={spendings => updateDisplaySpendings(spendings)}
          />
        ) : null}
      </section>
      <section>
        {Object.keys(spendingsByCategory.pending).length ? (
          <SpendingsList
            spendingsByCategory={spendingsByCategory.pending}
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
            accountId={account._meta.id}
            variables={variables}
            onUpdateSpendings={spendings => {
              updateDisplaySpendings([...spendings]);
            }}
          />
        ) : null}
      </section>
    </>
  );
};
