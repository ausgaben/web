import React from 'react';
import { Connect } from 'aws-amplify-react';
import { PredefinedValueButton } from './PredefinedValueButton';

export const ValueSelector = ({
  values,
  onSelect,
  onDelete,
  disabled
}: {
  values: string[];
  onSelect: (value: string) => void;
  onDelete: (value: string) => void;
  disabled?: boolean;
}) => {
  if (!values.length) {
    return null;
  }
  return (
    <div className="valueSelector">
      {values.map(method => (
        <PredefinedValueButton
          value={method}
          onSelect={() => onSelect(method)}
          onDelete={() => onDelete(method)}
          key={method}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
