import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../button/Icon';
import { IconWithText } from '../button/IconWithText';

export const Toggle = ({ states, value, onChange, onClick }) => {
  const items = states.map(({ label, value: stateValue, style, icon }, idx) => {
    const active = stateValue === value;
    return (
      <label
        key={idx}
        className={classNames({
          btn: true,
          [`btn-outline-${style || 'secondary'}`]: true,
          active
        })}
      >
        <input
          type="radio"
          name="options"
          autoComplete="off"
          checked={active}
          onChange={() => onChange && onChange(stateValue)}
          onClick={() => onClick && onClick(stateValue)}
        />
        {active && (
          <IconWithText icon={<Icon>{icon || 'check'}</Icon>}>
            {label}
          </IconWithText>
        )}
        {!active && <span>{label}</span>}
      </label>
    );
  });
  return (
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      {items}
    </div>
  );
};

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      style: PropTypes.oneOf([
        'secondary',
        'danger',
        'success',
        'warning',
        'info'
      ]),
      icon: PropTypes.string
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onClick: PropTypes.func
};
