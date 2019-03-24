import React from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { Cache } from 'aws-amplify';

export const About = () => (
  <Card>
    <CardHeader>About</CardHeader>
    <CardBody>
      <p>
        <Button
          outline
          color="danger"
          onClick={() => {
            Cache.clear();
          }}
        >
          Clear app cache
        </Button>
      </p>
    </CardBody>
  </Card>
);
