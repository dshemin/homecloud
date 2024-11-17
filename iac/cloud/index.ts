import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Service } from "./service";
import { Buffer } from "buffer";

const config = new pulumi.Config();

const main = () => {
  createNamespace();

  createPostgresql();
};

const NAMESPACE = "homecloud";

const createNamespace = (): void => {
  new k8s.core.v1.Namespace("namespace", {
    metadata: {
      name: NAMESPACE,
      labels: {
        name: NAMESPACE,
      },
    },
  });
};

const createPostgresql = (): void => {
  new Service("postgresql", {
    namespace: NAMESPACE,
    secrets: {
      "postgresql-secret": {
        "postgres-password": config
          .requireSecret("postgresqlPassword")
          .apply(base64),
      },
    },
    chart: {
      chart: "oci://registry-1.docker.io/bitnamicharts/postgresql",
      version: "16.2.1",
      values: {
        auth: {
          existingSecret: "postgresql-secret",
        },
        architecture: "standalone",
        primary: {
          persistence: {
            size: "4G",
          },
        },
      },
    },
  });
};

const base64 = (s: string): string => {
  return Buffer.from(s, "utf8").toString("base64");
};

main();
