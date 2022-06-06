export {Endpoints, DockerSnapshot}

interface DockerSnapshot {
    DockerVersion: string;
    Containers: number;
    RunningContainerCount: number;
    StoppedContainerCount: number;
    HealthyContainerCount: number;
    ImageCount: number;
    ServiceCount: number;
    StackCount: number;
    Swarm: string;
    Time: number;
    TotalCPU: number;
    TotalMemory: number;
    VolumeCount: number;
}

interface Endpoints {
    id: string;
    name: string;
    type: number;
    groupId: number;
    status: number;
    public_url: string;
    host: string;
    tls: number;
    tls_ca: number;
    tls_cert: number;
    tls_key: number,
    snapshot: DockerSnapshot
}
