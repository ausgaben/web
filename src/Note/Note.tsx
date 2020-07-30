import React from "react";
import { Alert } from "reactstrap";

export const Note = ({ children }: { children: React.ReactNode }) => (
  <Alert color="warning">{children}</Alert>
);

export const Fail = ({ children }: { children: React.ReactNode }) => (
  <Alert color="danger">{children}</Alert>
);
