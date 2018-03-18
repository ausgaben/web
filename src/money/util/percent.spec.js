'use strict'

/* global describe, it, expect */

const {percent} = require('./percent')

describe('percent filter', () => {
  it('should format floats', () => {
      [
        [0.12, '12%'],
        [-0.12, '-12%']
      ].map(([value, formatted]) => expect(percent(value)).toEqual(formatted))
    }
  )
})
