import { Namespace } from "@pulumi/kubernetes/core/v1/namespace";

const createNamespace = (name: string): string => {
  new Namespace(`namespace-${name}`, {
    metadata: {
      name,
      labels: {
        name,
      },
    },
  });

  return name;
};

export const createHomecloudNamespace = (): string =>
  createNamespace("homecloud");
export const createCertManagerNamespace = (): string =>
  createNamespace("cert-manager");
