import * as k8s from "@pulumi/kubernetes";
import { Service } from "./service";
import { Buffer } from "buffer";

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
        "postgres-password": base64("123456"),
      },
    },
    chart: {
      name: "postgresql",
      repository: "https://charts.bitnami.com/bitnami",
      version: "12.3.1",
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
