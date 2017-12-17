import * as React from 'react';
import styles from './IconWithText.scss';

export const IconWithText = ({ icon, children }) => (
  <span className="iconWithText">
    {icon}
    <span>{children}</span>
  </span>
);
