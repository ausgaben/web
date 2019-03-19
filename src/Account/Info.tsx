import React from 'react';
import { graphqlOperation } from 'aws-amplify';
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

export const accountQuery = `
  query account($uuid: ID!) {
    account(uuid: $uuid) {
      items {
        name
        isSavingsAccount
      }
    }
  }
`;

export const Info = (props: { account: Account }) => {
  const {
    account: { name }
  } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
    </Card>
  );
};
