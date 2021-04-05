import gql from "graphql-tag";

export const OAuthCallback = gql`
  mutation sparebank1OAuthCallback($code: ID!) {
    sparebank1OAuthCallback(code: $code)
  }
`;

export type OAuthCodeVariables = {
  code: string;
};

export type OAuthCodeResult = {
  sparebank1OAuthCallback: void;
};
