import { Button, CardHeader, CardTitle } from 'reactstrap';
import React from 'react';
import { DateTime } from 'luxon';

import './ListingHeader.scss';

export const ListingHeader = ({
  title,
  refetch,
  next,
  children,
  prevMonth,
  nextMonth,
  startDate
}: {
  title: string;
  refetch: () => void;
  next?: () => void;
  prevMonth?: () => void;
  nextMonth?: () => void;
  children?: React.ReactNode;
  startDate?: DateTime;
}) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {children}
    {next && (
      <Button
        outline
        color={'secondary'}
        onClick={() => {
          next();
        }}
      >
        next
      </Button>
    )}
    <Button
      outline
      color={'secondary'}
      onClick={() => {
        refetch();
      }}
    >
      reload
    </Button>
    {startDate && (prevMonth || nextMonth) && (
      <nav className="dateRange">
        {prevMonth && (
          <Button
            outline
            color={'secondary'}
            onClick={() => {
              prevMonth();
            }}
          >
            &lt;
          </Button>
        )}
        {startDate.toFormat('LL.yyyy')}
        {nextMonth && (
          <Button
            outline
            color={'secondary'}
            onClick={() => {
              nextMonth();
            }}
          >
            &gt;
          </Button>
        )}
      </nav>
    )}
  </CardHeader>
);
