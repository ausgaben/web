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
import './Accounts.scss';
import { Account } from '../schema';

export const accountsQuery = `
  query accounts {
    accounts {
      items {
        _meta {
          uuid
        }
        name
        isSavingsAccount
      }
    }
  }
`;

export const Accounts = () => (
  <Card>
    <CardHeader>
      <CardTitle>Accounts</CardTitle>
    </CardHeader>
    <Connect query={graphqlOperation(accountsQuery)}>
      {({ data, loading, errors }: any) => {
        if (errors.length) {
          return (
            <>
              <h3>Error</h3>
              {JSON.stringify(errors)}
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
    </Connect>
    <CardFooter>
      <Link to="/account/new">Add a new account</Link>
    </CardFooter>
  </Card>
);
