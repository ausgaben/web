export type Account = {
  name: string;
  isSavingsAccount: boolean;
  _meta: EntityMeta;
};

export type EntityMeta = {
  id: string;
};

export type Currency = {
  id: string;
  toEUR: number;
  symbol: string;
};

export type Spending = {
  account: Account;
  bookedAt: string;
  category: string;
  description: string;
  amount: number;
  currency: Currency;
  isIncome: boolean;
  isPending: boolean;
  paidWith?: string;
  _meta: EntityMeta;
};
