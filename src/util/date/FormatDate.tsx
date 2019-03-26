import * as React from 'react';
import { date } from './util/date';
import './FormatDate.scss';

export const FormatDate = ({ date: d }: { date: string }) => {
  const dt = new Date(d);
  return (
    <time className="date" dateTime={dt.toISOString()}>
      {date(dt)}
    </time>
  );
};
