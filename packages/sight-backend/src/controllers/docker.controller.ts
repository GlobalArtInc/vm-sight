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

  public getContainerLogs = async (req, res) => {
    const { endpointId, containerId } = req.params;
    res.set('Content-Type', 'text/plain');
    const pattern = /\x1B\[([ABCD])/gm;
    const logs = await this.dockerService.getContainerLogs(endpointId, containerId, req.query);
    return res.send(logs.toString().replace(pattern, ''));
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

  public getImages = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getImages(endpointId));
  };

  public getImageById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    return res.status(200).json(await this.dockerService.getImageById(endpointId, imageId));
  };

  public getImageHistoryById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    return res.status(200).json(await this.dockerService.getImageHistoryById(endpointId, imageId));
  };

  public removeImageById = async (req, res) => {
    const { endpointId, imageId } = req.params;
    await this.dockerService.removeImageById(endpointId, imageId);
    return res.status(200).json({ status: 200 });
  };
}

export default DockerController;
