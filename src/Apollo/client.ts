import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { concat } from 'apollo-link';
import { AuthLink, AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import {
  SubscriptionHandshakeLink,
  CONTROL_EVENTS_KEY
} from 'aws-appsync/lib/link/subscription-handshake-link';
import { NonTerminatingLink } from 'aws-appsync/lib/link/non-terminating-link';
import { onError } from 'apollo-link-error';
import { split, from } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { ApolloLink, Observable } from 'apollo-link';
import { Auth } from 'aws-amplify';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache();

// @ts-ignore
persistCache({
  cache,
  // @ts-ignore
  storage: window.localStorage
});

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT });

const appSyncAuthLink = new AuthLink({
  url: process.env.REACT_APP_API_ENDPOINT,
  region: process.env.REACT_APP_AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: Auth.currentCredentials
  }
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

export const client = () =>
  new ApolloClient<NormalizedCacheObject>({
    defaultOptions: {
      query: {
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    },
    link: split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      concat(
        appSyncAuthLink,
        from([
          new NonTerminatingLink('controlMessages', {
            link: new ApolloLink(
              operation =>
                new Observable<any>(observer => {
                  const {
                    variables: {
                      [CONTROL_EVENTS_KEY]: controlEvents,
                      ...variables
                    }
                  } = operation;

                  if (typeof controlEvents !== 'undefined') {
                    operation.variables = variables;
                  }

                  observer.next({ [CONTROL_EVENTS_KEY]: controlEvents });

                  return () => {};
                })
            )
          }),
          new NonTerminatingLink('subsInfo', { link: httpLink }),
          new SubscriptionHandshakeLink('subsInfo')
        ])
      ),
      concat(errorLink, concat(appSyncAuthLink, httpLink))
    ),
    cache
  });
