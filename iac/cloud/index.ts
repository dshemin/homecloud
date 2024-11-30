import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Service } from "./service";
import { Buffer } from "buffer";
import { postgresqlPassword as POSTGRESQL_PASSWORD_NAME } from "./config";

const config = new pulumi.Config();

const main = () => {
  createNamespaces();

  createCertManager();

  createPostgresql();
  createWhoDB();
};

const MAIN_NAMESPACE = "homecloud";
const CERT_MANAGER_NAMESPACE = "cert-manager";

const createNamespaces = (): void => {
  const namespaces = [MAIN_NAMESPACE, CERT_MANAGER_NAMESPACE];

  namespaces.forEach(
    (name) =>
      new k8s.core.v1.Namespace(`namespace-${name}`, {
        metadata: {
          name,
          labels: {
            name,
          },
        },
      }),
  );
};

const createCertManager = (): void => {
  new Service("cert-manager", {
    namespace: CERT_MANAGER_NAMESPACE,
    chart: {
      chart: "cert-manager",
      repo: "https://charts.jetstack.io",
      version: "1.16.2",
      values: {
        installCRDs: true,
        prometheus: {
          enabled: false,
        },
      },
    },
  });
};

const createPostgresql = (): void => {
  new Service("postgresql", {
    namespace: MAIN_NAMESPACE,
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
  config.requireSecret(POSTGRESQL_PASSWORD_NAME).apply(
    (pass) =>
      new Service("whodb", {
        namespace: MAIN_NAMESPACE,
        chart: {
          chart: "oci://ghcr.io/dshemin/whodb",
          version: "0.1.0",
          values: {
            profiles: {
              postgres: [
                {
                  host: `postgresql.${MAIN_NAMESPACE}.svc.cluster.local`,
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
