import React, { useState } from "react";
import { Input, ListGroup, ListGroupItem } from "reactstrap";
import styled from "styled-components";

const AutoCompleteInput = styled.div`
  width: 100%;
  position: relative;
`;

const StyledListGroup = styled(ListGroup)`
  position: absolute;
  z-index: 99;
`;

export const AutoComplete = ({
  strings,
  disabled,
  tabIndex,
  name,
  id,
  placeholder,
  onChange,
  value,
  required,
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
  const [autoCompleteHidden, setAutoCompleteHidden] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const hits = showAll
    ? strings
    : value.length > 0
    ? strings
        .filter((s) => s.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        .slice(0, 9)
    : [];
  return (
    <AutoCompleteInput>
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
          setShowAll(false);
        }}
        autoComplete="off"
        onKeyUp={({ key, ctrlKey }) => {
          if (key === "ArrowUp") {
            setHighLight(Math.max(0, highlight - 1));
          }
          if (key === "PageUp") {
            setHighLight(0);
          }
          if (key === "PageDown") {
            setHighLight(hits.length - 1);
          }
          if (key === "ArrowDown") {
            setHighLight(Math.min(hits.length - 1, highlight + 1));
          }
          if (key === "Enter") {
            onChange(hits[highlight]);
            setAutoCompleteHidden(true);
          }
          if (key === "Escape") {
            setAutoCompleteHidden(true);
          }
          if (key === " " && ctrlKey) {
            // Ctrl+Space was pressed, show all values
            setAutoCompleteHidden(false);
            setHighLight(-1);
            setShowAll(true);
          }
        }}
        onBlur={() => {
          setAutoCompleteHidden(true);
          if (highlight !== -1) {
            onChange(hits[highlight]);
          }
          setHighLight(-1);
        }}
      />
      {!autoCompleteHidden && hits.length > 0 && (
        <StyledListGroup>
          {hits.map((s, i) => (
            <ListGroupItem
              key={i}
              color={highlight === i || value === s ? "info" : undefined}
              onMouseEnter={() => {
                setHighLight(i);
              }}
            >
              {s}
            </ListGroupItem>
          ))}
        </StyledListGroup>
      )}
    </AutoCompleteInput>
  );
};
