import { Config, output } from "@pulumi/pulumi";

const config = new Config();

export const namespaces = {
  main: output("homecloud"),
  certManager: output("cert-manager"),
};

export const postgresql = {
  password: config.requireSecret("postgresqlPassword"),
  username: output("postgres"),
};
