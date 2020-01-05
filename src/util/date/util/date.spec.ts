/* global describe, it, expect */

import { date } from './date';

describe('date filter', () => {
  it('should format dates', () => {
    [
      [new Date(`2017-07-01T17:56:47.921Z`), '1.7.2017'],
      [
        new Date(
          `${new Date().toISOString().substring(0, 4)}-07-01T17:56:47.921Z`
        ),
        '1.7.'
      ]
    ].map(([value, formatted]) => {
      expect(date(value as Date)).toEqual(formatted);
    });
  });
});
