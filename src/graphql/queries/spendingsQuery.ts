import gql from "graphql-tag";
import { DateTime } from "luxon";

export const spendingsQuery = gql`
  query spendings(
    $accountId: ID!
    $startDate: String!
    $endDate: String!
    $startKey: ID
  ) {
    spendings(
      accountId: $accountId
      startDate: $startDate
      endDate: $endDate
      startKey: $startKey
    ) {
      items {
        _meta {
          id
        }
        bookedAt
        booked
        category
        description
        amount
        currency {
          id
          symbol
        }
        account {
          _meta {
            id
          }
          name
        }
        transferToAccount {
          _meta {
            id
          }
          name
        }
      }
      nextStartKey
    }
  }
`;

export const month = (
  startDate: DateTime = DateTime.local().startOf("month")
) => {
  const endDate = startDate.endOf("month");
  return {
    startDate,
    endDate,
  };
};

export const allTime = () => {
  const startDate = DateTime.fromJSDate(
    new Date("2000-01-01T00:00:00")
  ).startOf("month");
  const endDate = DateTime.fromJSDate(new Date("2100-01-01T00:00:00"));
  return {
    startDate,
    endDate,
  };
};
