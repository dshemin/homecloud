import {
  createHomecloudNamespace,
  createCertManagerNamespace,
} from "./src/namespaces";
import { createCertManager } from "./src/cert-manager";
import { createPostgresql } from "./src/postgresql";
import { createWhoDB } from "./src/whodb";
import { createDBOperator } from "./src/db-operator";
import { postgresqlPassword } from "./src/config";

const hcnm = createHomecloudNamespace();
const cmnm = createCertManagerNamespace();

createCertManager(cmnm);

createPostgresql(hcnm, postgresqlPassword);

createWhoDB(hcnm, postgresqlPassword);
createDBOperator(hcnm, postgresqlPassword);
