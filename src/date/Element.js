import * as React from 'react';
import { date } from './util/date';

export const Date = props => (
  <>{date(props.children, { symbol: ` ${props.symbol || '€'}` })}</>
);
