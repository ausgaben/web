import React from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { Cache } from "aws-amplify";
import { AuthDataContext } from "../App";

export const About = () => (
  <Card>
    <CardHeader>About</CardHeader>
    <CardBody>
      <dl>
        <dt>User</dt>
        <dd>
          <AuthDataContext.Consumer>
            {({ identityId }) => identityId}
          </AuthDataContext.Consumer>
        </dd>
        {process.env.REACT_APP_SPAREBANK1_API_CLIENT_ID !== undefined && (
          <>
            <dt>Sparebank1 Integration</dt>
            <dd>
              <a
                href={`https://api.sparebank1.no/oauth/authorize?client_id=${
                  process.env.REACT_APP_SPAREBANK1_API_CLIENT_ID
                }&state=AUTHENTICATE&redirect_uri=${encodeURIComponent(
                  new URL(document.location.href).origin
                )}&response_type=code`}
              >
                Authenticate with Sparebank1
              </a>
            </dd>
          </>
        )}
      </dl>
      <hr />
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
