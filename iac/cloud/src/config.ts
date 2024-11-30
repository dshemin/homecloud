import { Config } from "@pulumi/pulumi";

const config = new Config();

export const postgresqlPassword = config.requireSecret("postgresqlPassword");
