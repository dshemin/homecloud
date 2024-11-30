import { Output } from "@pulumi/pulumi";

import { Service } from "./service";
import { base64 } from "./utils";

export const createPostgresql = (namespace: string, password: Output<string>) =>
  new Service("postgresql", {
    namespace,
    secrets: {
      "postgresql-secret": {
        "postgres-password": password.apply(base64),
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
