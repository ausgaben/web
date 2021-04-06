export const remove = <T>(arr: T[], el: T): T[] => {
  const i = arr.indexOf(el);
  if (i < 0) return [...arr];
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
};
