export enum EndpointConnectionTypeEnum {
  LOCAL_DOCKER = 'local_docker',
  REMOTE_DOCKER = 'remote_docker',
  K8S = 'k8s_cluster',
}

export interface Endpoint {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  publicUrl: string;
  connectionInfo: Record<string, unknown>;
  connectionType: EndpointConnectionTypeEnum;
  serviceInfo: any;
}
