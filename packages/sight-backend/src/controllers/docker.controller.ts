import DockerService from '@services/docker.service';

class DockerController {
  public dockerService = new DockerService();

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker containers by endpointId
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainers = async (req, res) => {
    const { endpointId } = req.params;
    return res.status(200).json(await this.dockerService.getContainers(endpointId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker container by ID
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainerById = async (req, res) => {
    const { endpointId, containerId } = req.params;
    return res.status(200).json(await this.dockerService.getContainer(endpointId, containerId));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}/logs:
   *     get:
   *       tags:
   *       - docker
   *       summary: Get a docker container logs by ID
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public getContainerLogs = async (req, res) => {
    const { endpointId, containerId } = req.params;
    res.set('Content-Type', 'text/plain');
    const pattern = /\x1B\[([ABCD])/gm;
    const logs = await this.dockerService.getContainerLogs(endpointId, containerId, req.query);
    return res.send(logs.toString().replace(pattern, ''));
  };

  /**
   * @openapi
   *   /endpoints/{endpointId}/docker/containers/{containerId}:
   *     patch:
   *       tags:
   *       - docker
   *       summary: Execute a docker action
   *       parameters:
   *        - name: endpointId
   *          in: path
   *          description: Endpoint ID
   *          required: true
   *          type: string
   *        - name: containerId
   *          in: path
   *          description: Container ID
   *          required: true
   *          type: string
   *        - name: body
   *          in: body
   *          description: Docker actions DTO
   *          required: true
   *          schema:
   *            $ref: '#/definitions/dockerActionsDto'
   *       responses:
   *         200:
   *           description: 'Ok'
   *         404:
   *           description: 'The endpoint was not found'
   *         500:
   *           description: 'Server Error'
   */
  public containerAction = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.containerAction(req.body.action, endpointId, containerId);
    return res.status(200).json({ status: 200 });
  };

  public updateContainer = async (req, res) => {
    const { endpointId, containerId } = req.params;
    await this.dockerService.updateContainer(endpointId, containerId, req.body);
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

  public connectNetwork = async (req, res) => {
    const { endpointId, networkId } = req.params;
    const { Container } = req.body;
    await this.dockerService.connectNetwork(endpointId, networkId, Container);
    return res.status(200).send({ status: 200 });
  };

  public disconnectNetwork = async (req, res) => {
    const { endpointId, networkId } = req.params;
    const { Container } = req.body;
    await this.dockerService.disconnectNetwork(endpointId, networkId, Container);
    return res.status(200).send({ status: 200 });
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
