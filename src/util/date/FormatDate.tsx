import * as React from 'react';
import { date } from './util/date';
import styled from 'styled-components';

const Time = styled.time`
  white-space: nowrap;
  display: inline-block;
`;

export const FormatDate = ({ date: d }: { date: string }) => {
  const dt = new Date(d);
  return <Time dateTime={dt.toISOString()}>{date(dt)}</Time>;
};
