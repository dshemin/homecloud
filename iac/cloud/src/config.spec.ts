import { runtime, all } from "@pulumi/pulumi";
import * as assert from "assert";

runtime.setAllConfig(
  {
    "project:postgresqlPassword": "postgresql-password",
  },
  ["project:postgresqlPassword"],
);

describe("config", async () => {
  const config = await import("./config");

  it("should return correct values", () => {
    all([
      config.namespaces.main,
      config.namespaces.certManager,
      config.postgresql.password,
      config.postgresql.username,
    ]).apply(([nMain, nCertManager, pPassword, pUsername]) => {
      assert.equal(nMain, "homecloud");
      assert.equal(nCertManager, "cert-manager");
      assert.equal(pPassword, "postgresql-password");
      assert.equal(pUsername, "postgres");
    });
  });
});
