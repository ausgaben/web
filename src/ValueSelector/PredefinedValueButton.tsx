import React, { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";

export const PredefinedValueButton = ({
  value,
  selected,
  onSelect,
  onDelete,
  disabled,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  disabled?: boolean;
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0 as any);
  return (
    <ButtonGroup>
      <Button
        tabIndex={-1}
        color="info"
        size="sm"
        outline={!selected}
        disabled={disabled}
        onClick={() => onSelect()}
      >
        {value}
      </Button>
      <Button
        tabIndex={-1}
        color={confirmDelete ? "danger" : "info"}
        size="sm"
        outline={!confirmDelete}
        disabled={disabled}
        onClick={() => {
          if (confirmDelete) {
            clearTimeout(timeoutId);
            onDelete();
          } else {
            setConfirmDelete(true);
            setTimeoutId(
              setTimeout(() => {
                setConfirmDelete(false);
              }, 1000)
            );
          }
        }}
      >
        {!confirmDelete ? "⨯" : "⁉️"}
      </Button>
    </ButtonGroup>
  );
};
