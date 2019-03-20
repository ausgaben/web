import React from 'react';
import { Connect } from 'aws-amplify-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter
} from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Link } from 'react-router-dom';
import './Info.scss';
import { Account } from '../schema';

export const Info = (props: { account: Account }) => {
  const {
    account: {
      name,
      _meta: { uuid }
    }
  } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Link to={`/account/${uuid}/settings`}>Settings</Link>
      </CardFooter>
    </Card>
  );
};
