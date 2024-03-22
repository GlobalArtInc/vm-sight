export type DockerFunctions = 'info' | 'configs' | 'checkConnection' | 'containers' | 'images' | 'volumes' | 'nodes' | 'services' | 'tasks' | 'secrets';

export type DockerContainersActions =
  | 'list'
  | 'create'
  | 'inspect'
  | 'logs'
  | 'kill'
  | 'start'
  | 'stop'
  | 'restart'
  | 'update'
  | 'rename'
  | 'pause'
  | 'unpause'
  | 'attach'
  | 'remove';

export type DockerImagesActions =
  | 'list'
  | 'build'
  | 'delete'
  | 'create'
  | 'inspect'
  | 'history'
  | 'push'
  | 'tag'
  | 'remove'
  | 'search'
  | 'prune'
  | 'import';

export type DockerVolumesActions = 'list' | 'create' | 'inspect' | 'remove' | 'prune';

export type DockerNodesActions = 'list' | 'inspect' | 'delete' | 'update';

export type DockerServicesActions = 'list' | 'create' | 'inspect' | 'delete' | 'update' | 'logs'

export type DockerTasksActions = 'list' | 'inspect'

export type DockerSecretsActions = 'list' | 'create' | 'inspect' | 'delete' | 'update';

export type DockerConnectionParamsLocal = {
  socketPath: string;
};

export type DockerConnectionParamsRemote = {
  host: string;
  port: string;
  ca?: string;
  cert?: string;
};
