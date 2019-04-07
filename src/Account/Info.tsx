import React from 'react';
import { Card, CardHeader, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Account } from '../schema';

export const Info = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { id }
    }
  } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to={`/accounts`}>⬅</Link> {name}
        </CardTitle>
        <Link to={`/account/${id}/new/spending`}>Add Spending</Link>
        <Link to={`/account/${id}/import`}>Import</Link>
        <Link to={`/account/${id}/settings`}>Settings</Link>
      </CardHeader>
    </Card>
  );
};
