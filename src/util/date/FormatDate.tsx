import * as React from 'react';
import { date } from './util/date';

export const FormatDate = ({ date: d }: { date: string }) => (
  <>{date(new Date(d))}</>
);
