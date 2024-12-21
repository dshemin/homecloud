import { base64 } from "./utils";
import * as assert from "assert";

describe("utils", () => {
  describe("#base64", () => {
    const cases = [
      { given: "", expected: "" },
      { given: "foo", expected: "Zm9v" },
    ];

    cases.forEach(({ given, expected }) => {
      it(`base64("${given}") == "${expected}"`, () => {
        const actual = base64(given);

        assert.equal(actual, expected);
      });
    });
  });
});
