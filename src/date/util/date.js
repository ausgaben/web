'use strict'

const { DateTime } = require('luxon');

const dateFormat = (value, opts = {}) => {
  const d = DateTime.fromJSDate(value)
  return d.setLocale(opts.locale).toFormat(opts.format);
}

module.exports = {
  date: (date, opts) => dateFormat(date, {...opts, locale: 'de', format: 'd.L.'})
}
