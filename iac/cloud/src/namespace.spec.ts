import { runtime, output } from "@pulumi/pulumi";
import * as assert from "assert";

runtime.setMocks({
  newResource: function (args: runtime.MockResourceArgs): {
    id: string;
    state: any;
  } {
    return {
      id: args.name + "_id",
      state: {
        ...args.inputs,
      },
    };
  },
  call: function (args: runtime.MockCallArgs) {
    return args;
  },
});

describe("namespace", () => {
  let module: typeof import("./namespace");

  before(async function () {
    module = await import("./namespace");
  });

  describe("#createNamespace", () => {
    it("should pass", (done) => {
      const namespace = module.createNamespace(output("foo"));

      namespace.id.apply((id) => {
        try {
          assert.strictEqual(id, "namespace-foo_id");
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
