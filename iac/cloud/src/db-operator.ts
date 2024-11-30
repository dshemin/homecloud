import { Output } from "@pulumi/pulumi";

import { Service } from "./service";
import { base64 } from "./utils";
import { CustomResource } from "@pulumi/kubernetes/apiextensions";

export const createDBOperator = (
  namespace: string,
  password: Output<string>,
) => {
  const secretName = "db-operator-secret";

  new Service("db-operator", {
    namespace: namespace,
    secrets: {
      [secretName]: {
        user: base64("postgres"),
        password: password.apply(base64),
      },
    },
    chart: {
      chart: "db-operator",
      repo: "https://kloeckner-i.github.io/charts/",
      version: "1.7.0",
    },
  });

  new CustomResource(`db-operator-instance`, {
    apiVersion: "kci.rocks/v1beta1",
    kind: "DbInstance",
    metadata: {
      name: "main",
      namespace,
    },
    spec: {
      adminSecretRef: {
        Name: secretName,
        Namespace: namespace,
      },
      engine: "postgres",
      generic: {
        host: `postgresql.${namespace}.svc.cluster.local`,
        port: 5432,
      },
    },
  });
};
