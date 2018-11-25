import { AccessDeniedError } from '@rheactorjs/errors';
import { HttpProblem, List } from '@rheactorjs/models';
import { CheckingAccount, Report, Spending } from '@ausgaben/models';

export class ApiGatewayClient {
  constructor(token, endpoint = process.env.API_ENDPOINT) {
    this.token = token;
    this.endpoint = endpoint;
  }

  post = (...args) => {
    return this.request('POST', ...args);
  };

  put = (...args) => {
    return this.request('PUT', ...args);
  };

  delete = (...args) => {
    return this.request('DELETE', ...args);
  };

  get = resource => {
    return this.request('GET', resource);
  };

  postLink = (...args) => {
    return this.methodLink('post', ...args);
  };

  deleteLink = (...args) => {
    return this.methodLink('delete', ...args);
  };

  putLink = (...args) => {
    return this.methodLink('put', ...args);
  };

  getLink = (...args) => {
    return this.methodLink('get', ...args);
  };

  methodLink = async (method, { $links }, rel, body, headers) => {
    return this[method](
      $links.find(({ rel: linkRel }) => linkRel === rel).href,
      body,
      headers
    );
  };

  request = async (method, resource, body, headers) => {
    const url = /^http/.test(resource)
      ? resource
      : `${this.endpoint}/${resource}`;
    const res = await fetch(url, {
      method,
      headers: {
        ...headers,
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
    case Spending.$context.toString():
      return Spending.fromJSON(data);
    default:
      throw new Error(`Unhandled context ${$context}!`);
  }
};
