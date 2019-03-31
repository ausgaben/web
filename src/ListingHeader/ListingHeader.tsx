import { Button, CardHeader, CardTitle } from 'reactstrap';
import React from 'react';

export const ListingHeader = ({
  title,
  refetch,
  nextStartKey,
  children
}: {
  title: string;
  refetch: (variables?: object) => void;
  nextStartKey?: string;
  children?: React.ReactNode;
}) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {children}
    {nextStartKey && (
      <Button
        outline
        color={'secondary'}
        onClick={() => {
          refetch({
            startKey: nextStartKey
          });
        }}
      >
        next
      </Button>
    )}
    <Button
      outline
      color={'secondary'}
      onClick={() => {
        refetch({
          startKey: undefined
        });
      }}
    >
      reload
    </Button>
  </CardHeader>
);
