import React from 'react';
import { Account } from '../schema';
import { autoCompleteStringsQuery } from '../graphql/queries/autoCompleteStringsQuery';
import { useQuery } from '@apollo/react-hooks';

export const WithAccountAutoCompleteStrings = (props: {
  account: Account;
  loading: React.ReactElement;
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
      _meta: { id: accountId },
    },
    children,
  } = props;

  const { data, loading, error, refetch } = useQuery(autoCompleteStringsQuery, {
    variables: {
      accountId,
    },
  });

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

  const categoryStrings = strings.find(({ field }) => field === 'category');

  const paidWithStrings = strings.find(({ field }) => field === 'paidWith');

  return children({
    autoCompleteStrings: {
      category: categoryStrings ? categoryStrings.strings : [],
      paidWith: paidWithStrings ? paidWithStrings.strings : [],
      categories: strings.reduce((categories, cat) => {
        if (/^category:.+/.test(cat.field)) {
          const category = cat.field.split(':', 2)[1];
          categories[category] = cat.strings;
        }
        return categories;
      }, {} as { [category: string]: string[] }),
    },
    refetch,
  });
};
