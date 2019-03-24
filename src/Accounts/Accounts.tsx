import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Form,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Link } from 'react-router-dom';
import './Accounts.scss';
import { Account } from '../schema';
import { Query } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { ListingHeader } from '../ListingHeader/ListingHeader';

export const Accounts = () => (
  <Form>
    <Card>
      <Query query={accountsQuery}>
        {({ data, loading, error, refetch }: any) => {
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
              <>
                <ListingHeader
                  title={'Accounts'}
                  refetch={refetch}
                  nextStartKey={data.accounts.nextStartKey}
                />
                <ListGroup flush>
                  {accounts.map(({ name, _meta: { id } }) => (
                    <ListGroupItem key={id}>
                      <Link to={`/account/${id}`}>{name}</Link>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </>
            );
          }
          return (
            <>
              <ListingHeader refetch={refetch} title={'Accounts'} />
              <CardBody>
                <Note>No accounts found.</Note>
              </CardBody>
            </>
          );
        }}
      </Query>
      <CardFooter>
        <Link to="/new/account">Add a new account</Link>
      </CardFooter>
    </Card>
  </Form>
);
