import { CertManager } from "@pulumi/kubernetes-cert-manager";

import {
  createHomecloudNamespace,
  createCertManagerNamespace,
} from "./src/namespaces";
import { createPostgresql } from "./src/postgresql";
import { createWhoDB } from "./src/whodb";
import { createDBOperator } from "./src/db-operator";
import { postgresqlPassword } from "./src/config";

const hcnm = createHomecloudNamespace();
const cmnm = createCertManagerNamespace();

new CertManager("cert-manager", {
  installCRDs: true,
  helmOptions: {
    namespace: cmnm,
  },
});

createPostgresql(hcnm, postgresqlPassword);

createWhoDB(hcnm, postgresqlPassword);
createDBOperator(hcnm, postgresqlPassword);
