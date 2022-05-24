import DockerService from '@services/docker.service';

class DockerController {
  public dockerService = new DockerService();

  public getContainers = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getContainers(endpointId));
  };

  public getContainerById = async (req, res) => {
    const { endpointId, containerId } = req.params;
    return res.status(200).json(await this.dockerService.getContainer(endpointId, containerId));
  };

  public startContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('start', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public stopContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('stop', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public killContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('kill', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public restartContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('restart', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public pauseContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('pause', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public resumeContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('resume', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public removeContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction('remove', endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public getNetworks = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getNetworks(endpointId));
  };

  public getNetworkById = async (req, res) => {
    const { endpointId, networkId } = req.params;
    return res.status(200).json(await this.dockerService.getNetworkById(endpointId, networkId));
  };

  public deleteNetworkById = async (req, res) => {
    const { endpointId, networkId } = req.params;
    await this.dockerService.removeNetworkById(endpointId, networkId);
    return res.status(200).json({ status: 200 });
  };
}

export default DockerController;
