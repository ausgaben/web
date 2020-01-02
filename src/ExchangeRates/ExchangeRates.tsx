import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  exchangeRateQuery,
  ExchangeRate,
  ExchangeRateVariables
} from '../graphql/queries/exchangeRateQuery';
import { Fail } from '../Note/Note';
import { Loading } from '../Loading/Loading';
import { NOK } from '../currency/currencies';
import { Query } from 'react-apollo';

const today = () =>
  new Date().toISOString().substring(0, 10) + 'T00:00:00.000Z';

export const ExchangeRates = () => (
  <Card>
    <CardHeader>Exchange Rates (NOK)</CardHeader>
    <CardBody>
      <Query<ExchangeRate, ExchangeRateVariables>
        query={exchangeRateQuery}
        fetchPolicy={'cache-first'}
        variables={{ currencyId: NOK.id, date: today() }}
      >
        {({ loading, error, data }) => (
          <>
            {loading && <Loading text="Loading exchange rates..." />}
            {error && <Fail>{JSON.stringify(error)}</Fail>}
            {data && (
              <dl>
                <dt>{data.exchangeRate.date}</dt>
                <dd>{data.exchangeRate.rate}</dd>
              </dl>
            )}
          </>
        )}
      </Query>
    </CardBody>
  </Card>
);
