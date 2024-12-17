import { CertManager } from "@pulumi/kubernetes-cert-manager";

import { createNamespace } from "./src/namespaces";
import { Postresql } from "./src/postgresql";
import { WhoDB } from "./src/whodb";
import { DBOperator } from "./src/db-operator";
import { namespaces, postgresql } from "./src/config";

createNamespace(namespaces.main);
createNamespace(namespaces.certManager);

new CertManager("cert-manager", {
  installCRDs: true,
  helmOptions: {
    namespace: namespaces.certManager,
  },
});

const pgsql = new Postresql("postgres", {
  namespace: namespaces.main,
  password: postgresql.password,
  size: "4G",
});

new WhoDB("whodb", {
  namespace: namespaces.main,
  username: postgresql.username,
  password: postgresql.password,
  host: pgsql.host,
});

new DBOperator("db-operator", {
  namespace: namespaces.main,
  dbUser: postgresql.username,
  dbPassword: postgresql.password,
  dbHost: pgsql.host,
});
