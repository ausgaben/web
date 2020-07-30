import { DateTime } from "luxon";

const dateFormat = (value: Date, opts: { locale: string; format: string }) => {
  const d = DateTime.fromJSDate(value);
  return d.setLocale(opts.locale).toFormat(opts.format);
};

export const date = (date: Date, opts?: { locale?: string }) =>
  dateFormat(date, {
    ...opts,
    locale: "de",
    format:
      date.getFullYear() === new Date().getFullYear() ? "d.L." : "d.L.yyyy",
  });
