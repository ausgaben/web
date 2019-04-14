import React from 'react';
import { Account } from '../schema';
import { Query } from 'react-apollo';
import { autoCompleteStringsQuery } from '../graphql/queries/autoCompleteStringsQuery';

class AutoCompleteStringsQuery extends Query<
  {
    autoCompleteStrings: { field: string; strings: string[] }[];
  },
  {
    accountId: string;
  }
> {}

export const WithAccountAutoCompleteStrings = (props: {
  account: Account;
  loading: React.ReactNode;
  children: (args: {
    autoCompleteStrings: {
      category: string[];
      paidWith: string[];
      categories: {
        [category: string]: string[];
      };
    };
    refetch: () => void;
  }) => React.ReactElement;
}) => {
  const {
    account: {
      _meta: { id: accountId }
    },
    children
  } = props;

  const variables = {
    accountId
  };

  return (
    <AutoCompleteStringsQuery
      query={autoCompleteStringsQuery}
      variables={variables}
    >
      {({ data, loading, error, refetch }: any) => {
        if (error) {
          return (
            <>
              <h3>Error</h3>
              {JSON.stringify(error)}
            </>
          );
        }
        if (loading || !data) return props.loading;
        const { autoCompleteStrings: strings } = data as {
          autoCompleteStrings: { field: string; strings: string[] }[];
        };

        const categoryStrings = strings.find(
          ({ field }) => field === 'category'
        );

        const paidWithStrings = strings.find(
          ({ field }) => field === 'paidWith'
        );

        return children({
          autoCompleteStrings: {
            category: categoryStrings ? categoryStrings.strings : [],
            paidWith: paidWithStrings ? paidWithStrings.strings : [],
            categories: strings.reduce(
              (categories, cat) => {
                if (/^category:.+/.test(cat.field)) {
                  const category = cat.field.split(':', 2)[1];
                  categories[category] = cat.strings;
                }
                return categories;
              },
              {} as { [category: string]: string[] }
            )
          },
          refetch
        });
      }}
    </AutoCompleteStringsQuery>
  );
};
