import { Output } from "@pulumi/pulumi";

import { ServiceResource, ServiceResourceArgs } from "./service";

export interface WhoDBArgs extends ServiceResourceArgs {
  username: Output<string>;
  password: Output<string>;
  host: Output<string>;
}

export class WhoDB extends ServiceResource<WhoDBArgs> {
  protected chart(): string {
    return "oci://ghcr.io/dshemin/whodb";
  }

  protected version(): string {
    return "0.1.0";
  }

  protected buildValues(args: WhoDBArgs): Record<string, any> {
    return {
      profiles: {
        postgres: [
          {
            host: args.host,
            user: args.username,
            password: args.password,
            port: "5432",
            database: "postgres",
          },
        ],
      },
    };
  }
}
