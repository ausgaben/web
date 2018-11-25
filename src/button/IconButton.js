import * as React from 'react';
import styles from './IconButton.scss';
import classNames from 'classnames';
import { Icon } from './Icon';

export const IconButton = ({
  onClick,
  disabled,
  icon,
  spin = false,
  children,
  color = 'primary',
  type = 'submit'
}) => (
  <button
    type={type}
    className={`btn btn-${color} withIcon`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon spin={spin}>{icon}</Icon>
    <span>{children}</span>
  </button>
);
