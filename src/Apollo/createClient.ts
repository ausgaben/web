import { ApolloClient } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client";
import { Auth } from "aws-amplify";
import { InMemoryCache } from "@apollo/client/core";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { AuthLink, AUTH_TYPE, AuthOptions } from "aws-appsync-auth-link";

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT });

const auth: AuthOptions = {
  type: AUTH_TYPE.AWS_IAM,
  credentials: Auth.currentCredentials,
};

const appSyncAuthLink = new AuthLink({
  url: process.env.REACT_APP_API_ENDPOINT,
  region: process.env.REACT_APP_AWS_REGION,
  auth,
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
    link: ApolloLink.from([appSyncAuthLink, httpLink]),
    cache,
  });
