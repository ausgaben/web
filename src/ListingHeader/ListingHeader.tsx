import { Button, CardHeader, CardTitle } from 'reactstrap';
import React from 'react';

export const ListingHeader = ({
  title,
  refetch,
  next,
  children
}: {
  title: string;
  refetch: () => void;
  next?: () => void;
  children?: React.ReactNode;
}) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {children}
    {next && (
      <Button
        outline
        color={'secondary'}
        onClick={() => {
          next();
        }}
      >
        next
      </Button>
    )}
    <Button
      outline
      color={'secondary'}
      onClick={() => {
        refetch();
      }}
    >
      reload
    </Button>
  </CardHeader>
);
