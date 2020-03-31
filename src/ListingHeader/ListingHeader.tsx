import { Button, CardHeader, CardTitle } from 'reactstrap';
import React from 'react';
import { DateTime } from 'luxon';
import styled from 'styled-components';

const DateRangeNav = styled.nav`
  display: flex;
  align-items: baseline;
`;

const DateRangeButton = styled(Button)`
  :first-child {
    margin-right: 0.5rem;
  }
  :last-child {
    margin-left: 0.5rem;
  }
`;

export const ListingHeader = ({
  title,
  refetch,
  next,
  children,
  prevMonth,
  nextMonth,
  startDate,
}: {
  title: string;
  refetch?: () => void;
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
    {refetch && (
      <Button
        outline
        color={'secondary'}
        onClick={() => {
          refetch();
        }}
      >
        refresh
      </Button>
    )}
    {startDate && (prevMonth || nextMonth) && (
      <DateRangeNav>
        {prevMonth && (
          <DateRangeButton
            outline
            color={'secondary'}
            onClick={() => {
              prevMonth();
            }}
          >
            &lt;
          </DateRangeButton>
        )}
        {startDate.toFormat('LL.yyyy')}
        {nextMonth && (
          <DateRangeButton
            outline
            color={'secondary'}
            onClick={() => {
              nextMonth();
            }}
          >
            &gt;
          </DateRangeButton>
        )}
      </DateRangeNav>
    )}
  </CardHeader>
);
