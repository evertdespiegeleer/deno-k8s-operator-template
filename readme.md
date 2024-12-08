![Header with Typescript, Deno and Kubernetes logo](/readme-assets/header.png)

# Typescript & Deno based kubernetes operator boilerplate 🍳

This repo serves as a boilerplate / example code for building a
[Kubernetes operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
using [Deno](https://deno.land/).

## What does the example code do?
It installs a cluster scoped custom resource definition (`greetings.k8s.evertdespiegeleer.com`). It watches that resources and logs whenever it gets created, modified or updated.
Every minute AND every time a 'greeting' resource is created or modified, a reconciliation function runs.
Every reconciliation, a greeting is logged. Its exact message is based on the Helm values and the 'greeting' custom resource spec. Two properties in the 'greeting' custom resource status are also updated: `lastReconciliation` and `randomNumber`.

## How does it work?

The official
[Kubernetes Node client](https://www.npmjs.com/package/@kubernetes/client-node)
is used to interact with the cluster. The custom resource is watched and
whenever an action is performed to it, an event is triggered. This is used to
trigger a certain reconciliation function. [BullMQ](https://docs.bullmq.io/) is
used to periodically check the state of things and trigger a reconciler function
which makes sure that – if needed – the state of things is updated to the
desired state.

## Local Development

- Make sure [Tilt](https://tilt.dev/) is installed on your system.
- Run a local Kubernetes cluster (e.g.: using [k3d](https://k3d.io/),
  [kind](https://kind.sigs.k8s.io/),
  [minikube](https://minikube.sigs.k8s.io/)...)
- Create a `.env` file and a `localdev-helm-values.yaml` file in the root of
  this project based on the example files.
- `export KUBECONFIG=<path of your kubeconfig>`
- `tilt up`
- You can use the manifests in the `./k8s/example` directory to deploy the
  custom resource and see the operator do its thing.
