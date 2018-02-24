import { AccessDeniedError } from '@rheactorjs/errors';
import { HttpProblem, List } from '@rheactorjs/models';
import { CheckingAccount, Report } from '@ausgaben/models';

export class ApiGatewayClient {
  constructor(token, endpoint = process.env.API_ENDPOINT) {
    this.token = token;
    this.endpoint = endpoint;
  }

  post = (resource, body) => {
    return this.request('POST', resource, body);
  };

  get = resource => {
    return this.request('GET', resource);
  };

  postLink = ({ $links }, rel, body) => {
    return this.post(
      $links.find(({ rel: linkRel }) => linkRel === rel).href,
      body
    );
  };

  request = async (method, resource, body) => {
    const url = /^http/.test(resource)
      ? resource
      : `${this.endpoint}/${resource}`;
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: this.token
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status >= 400) {
      throw new HttpProblem.fromJSON(await res.json());
    }
    if (res.status === 202) {
      return;
    }
    return present(await res.json());
  };
}

const present = data => {
  const $context = data.$context;
  switch ($context) {
    case List.$context.toString():
      return List.fromJSON(data, present);
    case CheckingAccount.$context.toString():
      return CheckingAccount.fromJSON(data);
    case Report.$context.toString():
      return Report.fromJSON(data);
    default:
      throw new Error(`Unhandled context ${$context}!`);
  }
};
