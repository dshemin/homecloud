import { Service } from "./service";

export const createCertManager = (namespace: string) =>
  new Service("cert-manager", {
    namespace,
    chart: {
      chart: "cert-manager",
      repo: "https://charts.jetstack.io",
      version: "1.16.2",
      values: {
        installCRDs: true,
        prometheus: {
          enabled: false,
        },
      },
    },
  });
