import { ApolloClient } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { concat } from "@apollo/client";
import { AuthLink, AUTH_TYPE } from "aws-appsync-auth-link/lib/auth-link";
import {
  SubscriptionHandshakeLink,
  CONTROL_EVENTS_KEY,
} from "aws-appsync-subscription-link/lib/subscription-handshake-link";
import { NonTerminatingLink } from "aws-appsync-subscription-link/lib/non-terminating-link";
import { onError } from "@apollo/client/link/error";
import { split, from } from "@apollo/client";
import { getMainDefinition } from "apollo-utilities";
import { OperationDefinitionNode } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { Auth } from "aws-amplify";
import { InMemoryCache } from "@apollo/client/core";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT });

const appSyncAuthLink = new AuthLink({
  url: process.env.REACT_APP_API_ENDPOINT,
  region: process.env.REACT_APP_AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: Auth.currentCredentials,
  },
});

const errorLink = onError(({ networkError }) => {
  if (networkError) {
    if (/Received status code 403/.test(networkError.message)) {
      Auth.signOut().then(() => {
        window.location.reload();
      });
    }
  }
});

export const createClient = () =>
  new ApolloClient<NormalizedCacheObject>({
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy: "cache-and-network",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
    link: split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === "OperationDefinition" && operation === "subscription";
      },
      concat(
        appSyncAuthLink,
        from([
          new NonTerminatingLink("controlMessages", {
            link: new ApolloLink(
              (operation) =>
                new Observable<any>((observer) => {
                  const {
                    variables: {
                      [CONTROL_EVENTS_KEY]: controlEvents,
                      ...variables
                    },
                  } = operation;

                  if (typeof controlEvents !== "undefined") {
                    operation.variables = variables;
                  }

                  observer.next({ [CONTROL_EVENTS_KEY]: controlEvents });

                  return () => {};
                })
            ),
          }),
          new NonTerminatingLink("subsInfo", { link: httpLink }),
          new SubscriptionHandshakeLink("subsInfo"),
        ])
      ),
      concat(errorLink, concat(appSyncAuthLink, httpLink))
    ),
    cache,
  });
