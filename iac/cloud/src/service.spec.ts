import { Output, output } from "@pulumi/pulumi";
import * as assert from "assert";

describe("service", () => {
  let module: typeof import("./service");

  before(async function () {
    module = await import("./service");
  });

  describe("#ServiceResource", () => {
    describe("#constructor", () => {
      it("should pass", (done) => {
        interface TestServiceArgs {
          namespace: Output<string>;
        }

        const service =
          new (class TestService extends module.ServiceResource<TestServiceArgs> {
            protected chart(): string {
              return "chart";
            }

            protected version(): string {
              return "version";
            }
          })("foo", {
            namespace: output("bar"),
          });

        service.host.apply((host) => {
          try {
            assert.strictEqual("foo.bar.svc.cluster.local", host);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });
});
