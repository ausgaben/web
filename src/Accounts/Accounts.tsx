import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardFooter,
  Button,
  Form
} from 'reactstrap';
import { Loading } from '../Loading/Loading';
import { Note } from '../Note/Note';
import { Link } from 'react-router-dom';
import './Accounts.scss';
import { Account } from '../schema';
import { Query } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';

const Header = ({
  refetch,
  nextStartKey
}: {
  refetch: (variables?: object) => void;
  nextStartKey?: string;
}) => (
  <CardHeader>
    <CardTitle>Accounts</CardTitle>
    <nav>
      {nextStartKey && (
        <Button
          outline
          color={'secondary'}
          onClick={() => {
            refetch({
              startKey: nextStartKey
            });
          }}
        >
          next
        </Button>
      )}
      <Button
        outline
        color={'secondary'}
        onClick={() => {
          refetch({
            startKey: undefined
          });
        }}
      >
        reload
      </Button>
    </nav>
  </CardHeader>
);

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
                <Header
                  refetch={refetch}
                  nextStartKey={data.accounts.nextStartKey}
                />
                <ListGroup flush>
                  {accounts.map(({ name, _meta: { uuid } }) => (
                    <ListGroupItem key={uuid}>
                      <Link to={`/account/${uuid}`}>{name}</Link>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </>
            );
          }
          return (
            <>
              <Header refetch={refetch} />
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
