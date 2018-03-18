'use strict'

/* global describe, it, expect */

const {money} = require('./money')

describe('money filter', () => {
  it('should format floats', () => {
    [
      [1234, '12,34 €'],
      [-1234, '-12,34 €'],
      [1200, '12,00 €'],
      [123456789, '1.234.567,89 €'],
      [-123456789, '-1.234.567,89 €'],
      [0, '0,00 €']
    ].map(([value, formatted]) => {
      expect(money(value)).toEqual(formatted)
    })
  })
})
