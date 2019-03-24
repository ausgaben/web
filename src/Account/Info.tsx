import React from 'react';
import { Connect } from 'aws-amplify-react';
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
        <CardTitle>{name}</CardTitle>
        <nav>
          <Link to={`/account/${id}/settings`}>Settings</Link>
        </nav>
      </CardHeader>
    </Card>
  );
};
