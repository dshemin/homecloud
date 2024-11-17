import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { stringify } from "yaml";

// An arguments for creating Service component.
export type ServiceArgs = {
  // A k8s namespace where all resource should be placed.
  namespace: string;

  // A map of all secrets for this service where key is a secret name which will
  // be used for reference this secret and value is secret data.
  secrets?: Secrets;

  // Values for HelmChard resource.
  chart: HelmChart;
};

export type Secrets = Record<string, Record<string, any>>;

export type HelmChart = {
  // A name of the chart.
  chart: string;

  // A chart version to use.
  version: string;

  // Values to customize default.
  values?: Record<string, any>;
};

// The service.
// Holds all common logic for declaring a service.
export class Service extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: ServiceArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("cloud:Service", name, args, opts);

    this.createSecrets(name, args.namespace, args.secrets ?? {});
    this.createHelmChart(name, args.namespace, args.chart);
  }

  private createSecrets(
    svcName: string,
    namespace: string,
    secrets: Record<string, valueof<Secrets>>,
  ) {
    Object.entries(secrets).forEach(([name, data]) => {
      new k8s.core.v1.Secret(name, {
        metadata: {
          name,
          namespace,
        },
        data,
      });
    });
  }

  private createHelmChart(
    svcName: string,
    namespace: string,
    chart: HelmChart,
  ) {
    new k8s.apiextensions.CustomResource(`${svcName}-helm`, {
      apiVersion: "helm.cattle.io/v1",
      kind: "HelmChart",
      metadata: {
        name: svcName,
        namespace,
      },
      spec: {
        chart: chart.chart,
        targetNamespace: namespace,
        version: chart.version,
        valuesContent: stringify(chart.values),
      },
    });
  }
}

type valueof<T> = T[keyof T];
