import React, { useState } from 'react';
import { PredefinedValueButton } from './PredefinedValueButton';
import {
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  ButtonGroup
} from 'reactstrap';

export const ValueSelector = ({
  value,
  values,
  onSelect,
  onDelete,
  onAdd,
  disabled
}: {
  value?: string;
  values: string[];
  onSelect: (value?: string) => void;
  onDelete?: (value: string) => void;
  onAdd: (value: string) => void;
  disabled?: boolean;
}) => {
  const [toggleAdd, setToggleAdd] = useState(values.length === 0);
  const [newValue, setNewValue] = useState('');
  return (
    <div className="valueSelector">
      <>
        {values.map(method => (
          <PredefinedValueButton
            selected={value === method}
            value={method}
            onSelect={() => onSelect(value === method ? undefined : method)}
            onDelete={() => (onDelete ? onDelete(method) : () => {})}
            key={method}
            disabled={disabled}
          />
        ))}
        {/*
        {!toggleAdd && (
          <ButtonGroup>
            <Button
              tabIndex={-1}
              color="secondary"
              size="sm"
              outline
              disabled={disabled}
              onClick={() => setToggleAdd(!toggleAdd)}
            >
              + Add
            </Button>
          </ButtonGroup>
        )}
        */}
        {toggleAdd && (
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button
                color="secondary"
                size="sm"
                outline
                onClick={() => setToggleAdd(false)}
              >
                ⨯
              </Button>
            </InputGroupAddon>
            <Input
              disabled={disabled}
              bsSize="sm"
              type="text"
              name="newValue"
              id="newValue"
              placeholder="e.g. 'VISA Debit'"
              minLength={1}
              innerRef={ref => ref && values.length && ref.focus()}
              value={newValue}
              onChange={({ target: { value } }) => {
                setNewValue(value.trim());
              }}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="primary"
                size="sm"
                disabled={disabled || !newValue.length}
                onClick={() => {
                  onAdd(newValue);
                  setToggleAdd(false);
                  setNewValue('');
                }}
              >
                add
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}
      </>
    </div>
  );
};
