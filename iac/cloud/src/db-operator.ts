import { Output } from "@pulumi/pulumi";

import { ServiceResource, ServiceResourceArgs } from "./service";
import { base64 } from "./utils";
import { CustomResourceArgs } from "@pulumi/kubernetes/apiextensions";

export interface DBOperatorArgs extends ServiceResourceArgs {
  dbUser: Output<string>;
  dbPassword: Output<string>;
  dbHost: Output<string>;
}

export class DBOperator extends ServiceResource<DBOperatorArgs> {
  protected chart(): string {
    return "db-operator";
  }

  protected repo(): string {
    return "https://kloeckner-i.github.io/charts/";
  }

  protected version(): string {
    return "1.7.0";
  }

  protected secrets(args: DBOperatorArgs): Record<string, Record<string, any>> {
    const key = `${this.name}-secret`;

    return {
      [key]: {
        user: args.dbUser.apply(base64),
        password: args.dbPassword.apply(base64),
      },
    };
  }

  protected resources(
    args: DBOperatorArgs,
  ): Record<string, CustomResourceArgs> {
    const key = `${this.name}-instance`;
    const secretName = `${this.name}-secret`;

    return {
      [key]: {
        apiVersion: "kci.rocks/v1beta1",
        kind: "DbInstance",
        metadata: {
          name: "main",
          namespace: this.namespace,
        },
        spec: {
          adminSecretRef: {
            Name: secretName,
            Namespace: this.namespace,
          },
          engine: "postgres",
          generic: {
            host: args.dbHost,
            port: 5432,
          },
        },
      },
    };
  }
}
