export type DockerFunctions = 'info' | 'config' | 'checkConnection' | 'containers' | 'images';

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
  | 'deleteUnused'
  | 'import';

export type DockerConnectionParamsLocal = {
  socketPath: string;
};

export type DockerConnectionParamsRemote = {
  host: string;
  port: string;
  ca?: string;
  cert?: string;
};
