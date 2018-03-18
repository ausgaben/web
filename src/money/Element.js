import * as React from 'react';
import { money } from './util/money';
import { percent } from './util/percent';
import styles from './Styles.scss';

export const Money = props => (
  <>{money(props.children, { symbol: ` ${props.symbol || '€'}` })}</>
);
export const Percent = props => <>{percent(props.children)}</>;
