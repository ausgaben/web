export type Account = {
  name: string;
  isSavingsAccount: boolean;
  defaultCurrency: Currency;
  _meta: EntityMeta;
};

export type EntityMeta = {
  id: string;
  name: string;
  version: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type Currency = {
  id: string;
  symbol: string;
};

export type Spending = {
  account: Account;
  bookedAt: string;
  category: string;
  description: string;
  amount: number;
  currency: Currency;
  booked: boolean;
  _meta: EntityMeta;
  savingForAccount?: Account;
};
