import React, { useState } from "react";
import { Account, Spending } from "../schema";
import {
  allTime,
  month,
  spendingsQuery,
} from "../graphql/queries/spendingsQuery";
import { DateTime } from "luxon";
import { Cache } from "aws-amplify";
import { useQuery } from "@apollo/client";

const getDateSelection = (isSavingsAccount: boolean) => {
  if (isSavingsAccount) {
    return allTime();
  }
  const cached = Cache.getItem("withSpendings.startDate");
  return month(cached ? DateTime.fromISO(cached) : undefined);
};

export const WithSpendings = (props: {
  account: Account;
  loading: React.ReactElement;
  children: (args: {
    spendings: Spending[];
    refetch: () => void;
    next?: () => void;
    nextMonth?: () => void;
    prevMonth?: () => void;
    variables: any;
    startDate: DateTime;
  }) => React.ReactElement;
}) => {
  const {
    account: {
      isSavingsAccount,
      _meta: { id: accountId },
    },
    children,
  } = props;

  const [dateRange, setDateRange] = useState(
    getDateSelection(isSavingsAccount)
  );
  const { startDate, endDate } = dateRange;
  const variables = {
    accountId,
    startDate: startDate.toISO() as string,
    endDate: endDate.toISO() as string,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery<
    { spendings: { items: Spending[]; nextStartKey?: string } },
    {
      accountId: string;
      startDate: string;
      endDate: string;
      startKey?: string;
    }
  >(spendingsQuery, { variables });

  if (error) {
    return (
      <>
        <h3>Error</h3>
        {JSON.stringify(error)}
      </>
    );
  }
  if (loading || !data) return props.loading;
  const refetchFn = (startDate?: DateTime) => {
    if (isSavingsAccount) {
      return refetch(variables);
    }
    if (startDate) {
      Cache.setItem("withSpendings.startDate", startDate.toISO());
      const { endDate } = month(startDate);
      setDateRange({
        startDate,
        endDate,
      });
      return refetch({
        ...variables,
        startDate: startDate.toISO() as string,
        endDate: endDate.toISO() as string,
      });
    }
    return refetch(variables);
  };
  const k = data.spendings.nextStartKey;
  if (k) {
    fetchMore({
      variables: {
        ...variables,
        startKey: k,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const existingIds = prev.spendings.items.map(
          (spending) => spending._meta.id
        );
        const newSpendings = fetchMoreResult.spendings.items.filter(
          (spending) => !existingIds.includes(spending._meta.id)
        );
        return {
          spendings: {
            ...prev.spendings,
            items: [...prev.spendings.items, ...newSpendings],
            nextStartKey: fetchMoreResult.spendings.nextStartKey,
          },
        };
      },
    });
  }
  return children({
    spendings: data.spendings.items,
    refetch: refetchFn,
    variables,
    startDate,
    ...(!isSavingsAccount && {
      prevMonth: () => refetchFn(startDate.minus({ month: 1 })),
      nextMonth: () => refetchFn(startDate.plus({ month: 1 })),
    }),
  });
};
