import { Output } from "@pulumi/pulumi";
import { Namespace } from "@pulumi/kubernetes/core/v1/namespace";

export const createNamespace = (name: Output<string>) => {
  name.apply(
    (name) =>
      new Namespace(`namespace-${name}`, {
        metadata: {
          name,
          labels: {
            name,
          },
        },
      }),
  );
};
