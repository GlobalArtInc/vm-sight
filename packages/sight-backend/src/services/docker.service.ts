import Docker from "dockerode";

interface tls {
  active: boolean;
  ca: boolean;
  cert: boolean;
  key: boolean;
}

export class DockerService {
  constructor(private docker = new Docker()) {}

  /**
   * Connect to the docker server or via docker socket
   * @param host
   * @param tls
   */
  public checkConnect(host: string, tls: tls) {
    const settings: any = host.match("/var/run/docker.sock")
      ? { socketPath: "/var/run/docker.sock" }
      : {
          host: host.split(":")[0],
          port: host.split(":")[1],
        };
    if (tls.ca) {
      settings.ca = tls.ca;
    }
    if (tls.cert) {
      settings.cert = tls.cert;
    }
    if (tls.key) {
      settings.key = tls.key;
    }

    return new Promise((resolve, reject) => {
      if (settings.host && !settings.port) reject();
      new Docker(settings)
        .version()
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async data(endpoint) {
    const connect = await this.checkConnect(endpoint.url, {
      ...endpoint.tls,
      ...endpoint.ca,
      ...endpoint.cert,
      ...endpoint.key,
    });
    console.log(await this.docker.version());
    return connect;
  }
}

export default DockerService;
