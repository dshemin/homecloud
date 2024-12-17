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

    this.host = output(`${this.name}.${this.namespace}.svc.cluster.local`);

    this.registerOutputs({
      host: this.host,
    });
  }

  protected abstract chart(): string;

  protected repo(): string {
    return "";
  }

  protected abstract version(): string;

  protected secrets(args: T): Record<string, Record<string, any>> {
    return {};
  }

  protected buildValues(args: T): Record<string, any> {
    return {};
  }

  protected resources(args: T): Record<string, CustomResourceArgs> {
    return {};
  }

  private createSecrets(args: T) {
    Object.entries(this.secrets(args)).forEach(([name, data]) => {
      const s = new Secret(`${this.name}-secret-${name}`, {
        metadata: {
          name,
          namespace: this.namespace,
        },
        data,
      });

      this.registerOutputs({
        [name]: s,
      });
    });
  }

  private createHelmChart(args: T): CustomResource {
    const spec: Record<string, any> = {
      chart: this.chart(),
      targetNamespace: this.namespace,
      version: this.version(),
    };

    const repo = this.repo();

    if (repo != "") {
      spec.repo = repo;
    }

    const values = this.buildValues(args);
    if (args) {
      spec.valuesContent = stringify(values);
    }

    const cr = new CustomResource(`${this.name}-helm`, {
      apiVersion: "helm.cattle.io/v1",
      kind: "HelmChart",
      metadata: {
        name: this.name,
        namespace: this.namespace,
      },
      spec: spec,
    });

    this.registerOutputs({
      helm: cr,
    });

    return cr;
  }

  private createResources(args: T) {
    Object.entries(this.resources(args)).forEach(([name, data]) => {
      const r = new CustomResource(`${this.name}-${name}`, data);
    });
  }
}
