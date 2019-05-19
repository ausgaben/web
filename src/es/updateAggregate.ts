import { EntityMeta } from '../schema';

export const updateAggregate = <
  T extends {
    [key: string]: any;
    _meta: EntityMeta;
  }
>(
  aggregate: T
): T => ({
  ...aggregate,
  _meta: {
    ...aggregate._meta,
    version: aggregate._meta.version + 1,
    updatedAt: Date()
  }
});
