import { Output } from "@pulumi/pulumi";

import { Service } from "./service";

export const createWhoDB = (namespace: string, password: Output<string>) =>
  password.apply(
    (pass) =>
      new Service("whodb", {
        namespace: namespace,
        chart: {
          chart: "oci://ghcr.io/dshemin/whodb",
          version: "0.1.0",
          values: {
            profiles: {
              postgres: [
                {
                  host: `postgresql.${namespace}.svc.cluster.local`,
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
