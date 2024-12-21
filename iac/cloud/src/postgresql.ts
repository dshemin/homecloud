import { Output } from "@pulumi/pulumi";

import { ServiceResource, ServiceResourceArgs } from "./service";
import { base64 } from "./utils";

export interface PostgresqlArgs extends ServiceResourceArgs {
  password: Output<string>;
  size: string;
}

export class Postresql extends ServiceResource<PostgresqlArgs> {
  private static readonly SECRET_NAME = "postgresql-secret";

  protected chart(): string {
    return "oci://registry-1.docker.io/bitnamicharts/postgresql";
  }

  protected version(): string {
    return "16.2.1";
  }

  protected getSecrets(
    args: PostgresqlArgs,
  ): Record<string, Record<string, any>> {
    const key = `${this.name}-secret`;

    return {
      [key]: {
        "postgres-password": args.password.apply(base64),
      },
    };
  }

  protected getBuildValues(args: PostgresqlArgs): Record<string, any> {
    return {
      auth: {
        existingSecret: `${this.name}-secret`,
      },
      architecture: "standalone",
      primary: {
        persistence: {
          size: args.size,
        },
      },
    };
  }
}
