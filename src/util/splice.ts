export const splice = (
  arr: any[],
  start: number,
  deleteCount: number,
  ...items: any[]
) => [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];

export const remove = (arr: any[], item: any) =>
  splice(arr, arr.indexOf(item), 1);
