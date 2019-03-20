import React from 'react';
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
import './Accounts.scss';
import { Account } from '../schema';
import { Query } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';

export const Accounts = () => (
  <Card>
    <CardHeader>
      <CardTitle>Accounts</CardTitle>
    </CardHeader>
    <Query query={accountsQuery}>
      {({ data, loading, error }: any) => {
        if (error) {
          return (
            <>
              <h3>Error</h3>
              {JSON.stringify(error)}
            </>
          );
        }
        if (loading || !data) return <Loading />;
        if (data.accounts.items.length) {
          const accounts = data.accounts.items as Account[];
          return (
            <ListGroup flush>
              {accounts.map(({ name, _meta: { uuid } }) => (
                <ListGroupItem key={uuid}>
                  <Link to={`/account/${uuid}`}>{name}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          );
        }
        return (
          <CardBody>
            <Note>No accounts found.</Note>
          </CardBody>
        );
      }}
    </Query>
    <CardFooter>
      <Link to="/new/account">Add a new account</Link>
    </CardFooter>
  </Card>
);
