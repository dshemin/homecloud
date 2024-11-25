import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Service } from "./service";
import { Buffer } from "buffer";

const config = new pulumi.Config();

const main = () => {
  createNamespace();

  createPostgresql();
  createWhoDB();
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

const createWhoDB = (): void => {
  config.requireSecret("postgresqlPassword").apply(
    (pass) =>
      new Service("whodb", {
        namespace: NAMESPACE,
        chart: {
          chart: "oci://ghcr.io/dshemin/whodb",
          version: "0.1.0",
          values: {
            profiles: {
              postgres: [
                {
                  host: `postgresql.${NAMESPACE}.svc.cluster.local`,
                  user: "postgres",
                  password: pass,
                  port: "5432",
                  database: "postgres",
                },
              ],
            },
          },
        },
      }),
  );
};

const base64 = (s: string): string => {
  return Buffer.from(s, "utf8").toString("base64");
};

main();
