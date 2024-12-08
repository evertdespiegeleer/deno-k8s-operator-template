load('ext://namespace', 'namespace_create', 'namespace_inject')
load('ext://dotenv', 'dotenv')
load('ext://helm_resource', 'helm_resource', 'helm_repo')
load('ext://k8s_attach', 'k8s_attach')
dotenv()

allow_k8s_contexts(os.getenv('TILT_K8S_CONTEXT'))

default_registry(os.getenv('TILT_REGISTRY_URL'))

docker_build('operator',
             context='.',
             dockerfile='./dockerfile.dev',
             build_args={},

             live_update=[
                sync('./src', '/app/src'),
             ]
)

k8s_yaml(helm('k8s/helm', values=['localdev-helm-values.yaml']))

k8s_resource(workload='operator-deployment', port_forwards=12345)
