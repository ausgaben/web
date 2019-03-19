import React from 'react';
import { Alert } from 'reactstrap';

export const Note = ({ children }: { children: React.ReactNode }) => (
  <Alert color="warning">{children}</Alert>
);
