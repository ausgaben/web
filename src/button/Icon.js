import * as React from 'react';
import styles from './Icon.scss';
import classNames from 'classnames';

export const Icon = ({ spin = false, children }) => (
  <i className={classNames({ 'material-icons': true, spin })}>{children}</i>
);
