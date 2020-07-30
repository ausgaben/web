import React from "react";
import { Account } from "../schema";
import { WithSpendings } from "./WithSpendings";
import { Loading } from "../Loading/Loading";
import { SpendingsByCategory } from "./SpendingsByCategory";

export const Spendings = (props: { account: Account }) => (
  <WithSpendings {...props} loading={<Loading />}>
    {({
      spendings,
      variables,
      refetch,
      next,
      nextMonth,
      prevMonth,
      startDate,
    }) => (
      <SpendingsByCategory
        spendings={spendings}
        variables={variables}
        refetch={refetch}
        next={next}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
        startDate={startDate}
        account={props.account}
      />
    )}
  </WithSpendings>
);
