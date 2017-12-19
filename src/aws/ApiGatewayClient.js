import {AccessDeniedError} from '@rheactorjs/errors'
import {HttpProblem} from '@rheactorjs/models'

export class ApiGatewayClient {
    constructor(token, endpoint = process.env.API_ENDPOINT) {
        this.token = token
        this.endpoint = endpoint
    }

    post = (path) => {
        return this.request('POST', path)
    }

    request = async (method, resource, body) => {
        const res = await fetch(`${this.endpoint}/${resource}`,
            {
                method,
                headers: {
                    'Authorization': this.token
                },
                body: body ? JSON.stringify(body) : undefined
            }
        )
        const json = await res.json()
        if (res.status >= 400) {
            throw new HttpProblem.fromJSON(json)
        }
        return json
    }
}
