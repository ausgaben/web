'use strict'

/* global describe, it, expect */

const {date} = require('./date')

describe('date filter', () => {
  it('should format dates', () => {
    [
      [new Date("2018-07-01T17:56:47.921Z"), '1.7.'],
    ].map(([value, formatted]) => {
      expect(date(value)).toEqual(formatted)
    })
  })
})
