import { DateTime } from 'luxon';

const dateFormat = (value: Date, opts: { locale: string; format: string }) => {
  const d = DateTime.fromJSDate(value);
  return d.setLocale(opts.locale).toFormat(opts.format);
};

export const date = (date: Date, opts?: { locale?: string; format?: string }) =>
  dateFormat(date, { ...opts, locale: 'de', format: 'd.L.' });
