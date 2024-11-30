import { stringify } from "yaml";
import { Secret } from "@pulumi/kubernetes/core/v1/secret";
import { CustomResource } from "@pulumi/kubernetes/apiextensions";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

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

  // A repository path, not required. Should be provided only for http/https repositories.
  repo?: string;

  // A chart version to use.
  version: string;

  // Values to customize default.
  values?: Record<string, any>;
};

// The service.
// Holds all common logic for declaring a service.
export class Service extends ComponentResource {
  constructor(
    name: string,
    args: ServiceArgs,
    opts?: ComponentResourceOptions,
  ) {
    super("homecloud:cloud:Service", name, {}, opts);

    args.secrets = args.secrets ?? {};

    this.createSecrets(args.namespace, args.secrets);
    this.createHelmChart(name, args.namespace, args.chart);
  }

  private createSecrets(
    namespace: string,
    secrets: Record<string, valueof<Secrets>>,
  ) {
    Object.entries(secrets).forEach(([name, data]) => {
      new Secret(name, {
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
  ): CustomResource {
    const spec: Record<string, any> = {
      chart: chart.chart,
      targetNamespace: namespace,
      version: chart.version,
      valuesContent: stringify(chart.values),
    };

    if (chart.repo != "") {
      spec.repo = chart.repo;
    }

    return new CustomResource(`${svcName}-helm`, {
      apiVersion: "helm.cattle.io/v1",
      kind: "HelmChart",
      metadata: {
        name: svcName,
        namespace,
      },
      spec: spec,
    });
  }
}

type valueof<T> = T[keyof T];
