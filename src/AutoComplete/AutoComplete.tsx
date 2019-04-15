import React, { useState } from 'react';
import { Input, ListGroup, ListGroupItem } from 'reactstrap';
import './AutoComplete.scss';

export const AutoComplete = ({
  strings,
  disabled,
  tabIndex,
  name,
  id,
  placeholder,
  onChange,
  value,
  required
}: {
  strings: string[];
  disabled: boolean;
  tabIndex: number;
  name: string;
  id: string;
  placeholder: string;
  onChange: (v: string) => void;
  value: string;
  required?: boolean;
}) => {
  const [highlight, setHighLight] = useState(-1);
  const [autoCompleteHidden, setAutoCompleteHidden] = useState(false);
  const hits =
    value.length > 0
      ? strings
          .filter(s => s !== value)
          .filter(s => s.toLowerCase().indexOf(value.toLowerCase()) >= 0)
          .slice(0, 9)
      : [];
  return (
    <div className="inputWithAutoComplete">
      <Input
        disabled={disabled}
        tabIndex={tabIndex}
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={({ target: { value } }) => {
          onChange(value);
          setAutoCompleteHidden(false);
          setHighLight(-1);
        }}
        autoComplete="off"
        onKeyUp={({ key }) => {
          if (key === 'ArrowUp') {
            setHighLight(Math.max(0, highlight - 1));
          }
          if (key === 'PageUp') {
            setHighLight(0);
          }
          if (key === 'PageDown') {
            setHighLight(hits.length - 1);
          }
          if (key === 'ArrowDown') {
            setHighLight(Math.min(hits.length - 1, highlight + 1));
          }
          if (key === 'Enter') {
            onChange(hits[highlight]);
            setAutoCompleteHidden(true);
          }
          if (key === 'Escape') {
            setAutoCompleteHidden(true);
          }
        }}
      />
      {!autoCompleteHidden && hits.length > 0 && (
        <ListGroup>
          {hits.map((s, i) => (
            <ListGroupItem
              key={i}
              color={highlight === i ? 'info' : undefined}
              onMouseEnter={() => {
                setHighLight(i);
              }}
              onClick={() => {
                onChange(hits[i]);
                setAutoCompleteHidden(true);
              }}
            >
              {s}
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};
