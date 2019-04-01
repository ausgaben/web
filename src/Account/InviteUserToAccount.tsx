import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  Label
} from 'reactstrap';
import gql from 'graphql-tag';
import { Fail, Note } from '../Note/Note';
import { Account } from '../schema';
import { Mutation } from 'react-apollo';
import { accountsQuery } from '../graphql/queries/accountsQuery';
import { GraphQLError } from 'graphql';
import { Link } from 'react-router-dom';
import { createSpendingQuery } from '../AddSpending/AddSpending';

export const inviteUserMutation = gql`
  mutation inviteUser($accountId: ID!, $userId: ID!) {
    inviteUser(accountId: $accountId, userId: $userId) {
      id
    }
  }
`;

export const InviteUserToAccount = (props: { account: Account }) => {
  const [userId, setUserId] = useState('');
  return (
    <Mutation mutation={inviteUserMutation}>
      {inviteUserMutation => (
        <Form>
          <Label for="userid">User ID</Label>
          <InputGroup>
            <Input
              placeholder="e.g. 'eu-central-1:233b257f-b8b8-408a-9180-4afafe8a9dbd'"
              id="userid"
              value={userId}
              onChange={({ target: { value } }) => setUserId(value)}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="primary"
                disabled={userId.length === 0}
                onClick={async () => {
                  setUserId('');
                  inviteUserMutation({
                    variables: {
                      accountId: props.account._meta.id,
                      userId
                    }
                  });
                }}
              >
                Invite
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      )}
    </Mutation>
  );
};
