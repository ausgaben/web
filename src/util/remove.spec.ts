import { remove } from "./remove";

describe("remove", () => {
  it.each([
    [[1, 2, 3, 4], 2, [1, 3, 4]],
    [[1, 2, 3, 4], 1, [2, 3, 4]],
    [[1, 2, 3, 4], 4, [1, 2, 3]],
    [[1, 2, 3, 4], -1, [1, 2, 3, 4]],
    [[1, 2, 3, 4], 5, [1, 2, 3, 4]],
  ])("should remove from %s element %d and return %s", (inp, el, expected) => {
    const result = remove(inp, el);
    expect(result).toEqual(expected);
    expect(result).not.toBe(inp);
  });
});
