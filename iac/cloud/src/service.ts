import { stringify } from "yaml";
import { Secret } from "@pulumi/kubernetes/core/v1/secret";
import {
  CustomResource,
  CustomResourceArgs,
} from "@pulumi/kubernetes/apiextensions";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
  output,
  interpolate,
} from "@pulumi/pulumi";

export interface ServiceResourceArgs {
  namespace: Output<string>;
}

export abstract class ServiceResource<
  T extends ServiceResourceArgs,
> extends ComponentResource {
  public readonly host: Output<string>;

  protected readonly name: string;
  protected readonly namespace: Output<string>;

  constructor(name: string, args: T, opts?: ComponentResourceOptions) {
    super("homecloud:resource:Service", name, {}, opts);

    this.name = name;
    this.namespace = args.namespace;

    this.createSecrets(args);
    this.createHelmChart(args);
    this.createResources(args);

    this.host = output(
      interpolate`${this.name}.${this.namespace}.svc.cluster.local`,
    );

    this.registerOutputs({
      host: this.host,
    });
  }

  protected abstract chart(): string;

  protected repo(): string {
    return "";
  }

  protected abstract version(): string;

  protected getSecrets(args: T): Record<string, Record<string, any>> {
    return {};
  }

  protected getBuildValues(args: T): Record<string, any> {
    return {};
  }

  protected getResources(args: T): Record<string, CustomResourceArgs> {
    return {};
  }

  private createSecrets(args: T) {
    Object.entries(this.getSecrets(args)).forEach(([name, data]) => {
      const s = new Secret(`${this.name}-secret-${name}`, {
        metadata: {
          name,
          namespace: this.namespace,
        },
        data,
      });
    });
  }

  private createHelmChart(args: T) {
    const spec: Record<string, any> = {
      chart: this.chart(),
      targetNamespace: this.namespace,
      version: this.version(),
    };

    const repo = this.repo();

    if (repo != "") {
      spec.repo = repo;
    }

    const values = this.getBuildValues(args);
    if (args) {
      spec.valuesContent = stringify(values);
    }

    new CustomResource(`${this.name}-helm`, {
      apiVersion: "helm.cattle.io/v1",
      kind: "HelmChart",
      metadata: {
        name: this.name,
        namespace: this.namespace,
      },
      spec: spec,
    });
  }

  private createResources(args: T) {
    Object.entries(this.getResources(args)).forEach(([name, data]) => {
      new CustomResource(`${this.name}-${name}`, data);
    });
  }
}
