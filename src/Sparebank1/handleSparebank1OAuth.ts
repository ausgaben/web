import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  OAuthCallback,
  OAuthCodeResult,
  OAuthCodeVariables,
} from "./graphql/mutations/OAuthCode";

export const memorizeSparebank1OAuthCode = () => {
  const p = new URLSearchParams(document.location.href.split("?")[1]);
  const code = p.get("code");
  const state = p.get("state");

  if (code && state) {
    window.localStorage.setItem("sparebank1:code", code);
    window.localStorage.setItem("sparebank1:state", state);
    console.debug(`Stored sparebank1:code`);
  }
};

export const sparebank1OAuthCallback = async (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const code = window.localStorage.getItem("sparebank1:code");
  if (typeof code === "string") {
    window.localStorage.removeItem("sparebank1:code");
    console.debug(`Publishing sparebank1:code`);
    try {
      const res = await client.mutate<OAuthCodeResult, OAuthCodeVariables>({
        mutation: OAuthCallback,
        variables: {
          code,
        },
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }
};
